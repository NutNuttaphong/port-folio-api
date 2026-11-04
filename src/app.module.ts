import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';

import { MongooseModule } from '@nestjs/mongoose';
import { ProjectModule } from './project/project.module';
import { PortfolioModule } from './portfolio/portfolio.module';
import { AboutModule } from './about/about.module';
import { InspirationModule } from './inspiration/inspiration.module';
import { ServModule } from './serv/serv.module';
import { UserModule } from './user/user.module';
import { ContactModule } from './contact/contact.module';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGODB_URI ||
        process.env.MONGO_URL ||
        'mongodb://127.0.0.1:27017/project_management_db',
      {
        minPoolSize: 0, // ลด connection เหลือ 0 เมื่อ idle เพื่อให้ server sleep ได้
        maxIdleTimeMS: 30000, // ปิด idle connection ภายใน 30 วินาที
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      },
    ),
    ProjectModule,
    PortfolioModule,
    AboutModule,
    InspirationModule,
    ServModule,
    UserModule,
    ContactModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
