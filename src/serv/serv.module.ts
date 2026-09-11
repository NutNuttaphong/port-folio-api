import { Module } from '@nestjs/common';
import { ServService } from './serv.service';
import { ServController } from './serv.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Serv, ServSchema } from './serv.schema';

@Module({
  imports: [
    // 🔥 2. แก้ชื่อเป็น Portfolio.name และ PortfolioSchema
    MongooseModule.forFeature([{ name: Serv.name, schema: ServSchema }]),
  ],
  controllers: [ServController],
  providers: [ServService],
})
export class ServModule {}
