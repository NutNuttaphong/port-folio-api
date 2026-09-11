import { Module } from '@nestjs/common';
import { InspirationService } from './inspiration.service';
import { InspirationController } from './inspiration.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { Inspiration, InspirationSchema } from './inspiration.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Inspiration.name, schema: InspirationSchema },
    ]),
  ],
  controllers: [InspirationController],
  providers: [InspirationService],
})
export class InspirationModule {}
