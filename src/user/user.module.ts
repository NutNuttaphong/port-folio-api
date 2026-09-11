import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { MongooseModule } from '@nestjs/mongoose';

import { User, UserSchema } from './user.shema';

@Module({
  imports: [
    // 🔥 2. แก้ชื่อเป็น Portfolio.name และ PortfolioSchema
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
  controllers: [UserController],
  providers: [UserService],
})
export class UserModule {}
