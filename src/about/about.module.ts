import { Module } from '@nestjs/common';
import { AboutService } from './about.service';
import { AboutController } from './about.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { About, AboutSchema } from './about.schema';

@Module({
  imports: [
    // 🔥 2. แก้ชื่อเป็น Portfolio.name และ PortfolioSchema
    MongooseModule.forFeature([{ name: About.name, schema: AboutSchema }]),
  ],
  controllers: [AboutController],
  providers: [AboutService],
})
export class AboutModule {}
