import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express'; // 🔥 1. นำเข้า NestExpressApplication
import { join } from 'path';

async function bootstrap() {
  // 🔥 2. ระบุให้ NestJS รู้ว่าเราใช้ Express เป็นโครงสร้างหลัก (เพื่อจะได้ใช้คำสั่งแจกไฟล์ได้)
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors(); // (ถ้ามีอยู่แล้วคงไว้ครับ)

  // 🔥 3. ใช้คำสั่ง useStaticAssets ซึ่งเป็นท่ามาตรฐานของ NestJS
  app.useStaticAssets(join(process.cwd(), 'uploads'), {
    prefix: '/uploads/', // กำหนดว่าถ้า URL มี /uploads/ ให้มาหาไฟล์ที่นี่
  });

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
}
bootstrap();
