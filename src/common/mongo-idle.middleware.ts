import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class MongoIdleMiddleware implements NestMiddleware {
  private readonly logger = new Logger(MongoIdleMiddleware.name);
  private idleTimer: NodeJS.Timeout | null = null;
  private isConnecting = false;
  private readonly IDLE_TIMEOUT_MS = 90000; // 90 วินาที (1.5 นาที)

  constructor(@InjectConnection() private readonly connection: Connection) {
    this.scheduleIdleDisconnect();
  }

  private getMongoUri(): string {
    return (
      process.env.MONGODB_URI ||
      process.env.MONGO_URL ||
      'mongodb://127.0.0.1:27017/project_management_db'
    );
  }

  private scheduleIdleDisconnect() {
    if (this.idleTimer) clearTimeout(this.idleTimer);
    this.idleTimer = setTimeout(async () => {
      try {
        if (this.connection.readyState === 1) {
          this.logger.log(
            '💤 No HTTP traffic for 90s. Disconnecting MongoDB to allow Railway Serverless to sleep...',
          );
          await this.connection.close();
        }
      } catch (err: any) {
        this.logger.warn(`Error disconnecting MongoDB: ${err.message}`);
      }
    }, this.IDLE_TIMEOUT_MS);
  }

  async use(req: Request, res: Response, next: NextFunction) {
    // รีเซ็ตตัวนับเวลาทุกครั้งที่มี request เข้ามา
    this.scheduleIdleDisconnect();

    // ถ้า connection ถูกปิดไปแล้ว ให้ต่อใหม่ทันทีก่อนส่งต่อให้ controller
    if (this.connection.readyState === 0 || this.connection.readyState === 3) {
      if (!this.isConnecting) {
        this.isConnecting = true;
        try {
          this.logger.log('⚡ Incoming HTTP request. Reconnecting MongoDB...');
          await this.connection.openUri(this.getMongoUri(), {
            minPoolSize: 0,
            maxIdleTimeMS: 30000,
            serverSelectionTimeoutMS: 5000,
            socketTimeoutMS: 45000,
          });
          this.logger.log('✅ MongoDB reconnected successfully.');
        } catch (err: any) {
          this.logger.error(`❌ Failed to reconnect MongoDB: ${err.message}`);
        } finally {
          this.isConnecting = false;
        }
      } else {
        let retries = 25;
        while ((this.connection as any).readyState !== 1 && retries > 0) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries--;
        }
      }
    }

    next();
  }
}
