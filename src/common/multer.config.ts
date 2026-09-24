import { diskStorage } from 'multer';
import { extname } from 'path';
import { BadRequestException } from '@nestjs/common';
import * as fs from 'fs';

const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

export const multerOptions = {
  storage: diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      const ext = extname(file.originalname).toLowerCase();
      cb(null, `${uniqueSuffix}${ext}`);
    },
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // จำกัดขนาดไฟล์สูงสุด 5 MB
  },
  fileFilter: (req: any, file: any, cb: any) => {
    // อนุญาตเฉพาะไฟล์รูปภาพที่เป็น jpg, jpeg, png, webp, gif, svg
    if (file.mimetype.match(/\/(jpg|jpeg|png|webp|gif|svg\+xml)$/i)) {
      cb(null, true);
    } else {
      cb(
        new BadRequestException(
          'อนุญาตเฉพาะไฟล์รูปภาพ (jpg, jpeg, png, webp, gif, svg) เท่านั้น',
        ),
        false,
      );
    }
  },
};
