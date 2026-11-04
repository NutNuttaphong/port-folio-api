import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 🔥 1. นำเข้า NestExpressApplication
import { join } from 'path';

async function bootstrap() {
  // 🔥 2. ระบุให้ NestJS รู้ว่าเราใช้ Express เป็นโครงสร้างหลัก (เพื่อจะได้ใช้คำสั่งแจกไฟล์ได้)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const allowedOrigins = [
    'https://port-folio-web-phi.vercel.app',
    'http://localhost:5173',
    'http://localhost:3000',
  ];

  app.enableCors({
    origin: (origin, callback) => {
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith('.vercel.app')
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  });

  // 🔥 3. ใช้คำสั่ง useStaticAssets ซึ่งเป็นท่ามาตรฐานของ NestJS
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', // กำหนดว่าถ้า URL มี /uploads/ ให้มาหาไฟล์ที่นี่
  });

  const port = process.env.PORT || 3000;
  const server = await app.listen(port, '0.0.0.0');

  // ตั้งค่า Idle Timeout & Keep-Alive ให้ Server ตัด Connection ไวขึ้นเพื่อเข้าโหมด Sleep ได้
  if (server && 'keepAliveTimeout' in server) {
    (server as any).keepAliveTimeout = 5000;
    (server as any).headersTimeout = 6000;
  }
  console.log(`🚀 Application is successfully listening on 0.0.0.0:${port}`);
}
bootstrap();
