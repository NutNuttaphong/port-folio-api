import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { PortfolioService } from './portfolio.service';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';

import { diskStorage } from 'multer';
import { extname } from 'path';

export interface LocalFile {
  filename: string;
  originalname: string;
}

// 🔥 สร้างตัวแปรเก็บการตั้งค่าเซฟไฟล์ เพื่อจะได้เรียกใช้ซ้ำได้ทั้ง Post และ Patch แบบโค้ดไม่รก
const multerStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  async create(
    @Body() createPortfolioDto: CreatePortfolioDto, // 🔥 แก้ชื่อตัวแปรเป็นตัวพิมพ์เล็ก
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      createPortfolioDto.imageUrl = `/uploads/${file.filename}`;
    }
    // 🔥 เปลี่ยนจาก projectService เป็น portfolioService
    return await this.portfolioService.create(createPortfolioDto);
  }

  @Get()
  findAll() {
    return this.portfolioService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    // 🔥 ลบเครื่องหมาย + หน้า id ออก (เพราะ MongoDB ID เป็น String)
    return this.portfolioService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  async update(
    @Param('id') id: string,
    @Body() updatePortfolioDto: UpdatePortfolioDto, // 🔥 แก้ชื่อตัวแปรเป็นตัวพิมพ์เล็ก
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      updatePortfolioDto.imageUrl = `/uploads/${file.filename}`;
    }
    // 🔥 เปลี่ยนจาก projectService เป็น portfolioService และใส่ await
    return await this.portfolioService.update(id, updatePortfolioDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // 🔥 ลบเครื่องหมาย + หน้า id ออก
    return this.portfolioService.remove(id);
  }
}
