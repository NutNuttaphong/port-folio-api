import { Module } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { PortfolioController } from './portfolio.controller';
import { MongooseModule } from '@nestjs/mongoose';
// 🔥 1. แก้ไข Path ให้ดึงจากโฟลเดอร์เดียวกัน และใช้ชื่อให้ตรงกับในไฟล์ Schema
import { Portfolio, PortfolioSchema } from './portfolio.schema';

@Module({
  imports: [
    // 🔥 2. แก้ชื่อเป็น Portfolio.name และ PortfolioSchema
    MongooseModule.forFeature([
      { name: Portfolio.name, schema: PortfolioSchema },
    ]),
  ],
  controllers: [PortfolioController],
  providers: [PortfolioService],
})
export class PortfolioModule {}
