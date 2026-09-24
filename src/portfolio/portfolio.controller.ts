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

import { multerOptions } from '../common/multer.config';

export interface LocalFile {
  filename: string;
  originalname: string;
}

@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
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
  @UseInterceptors(FileInterceptor('image', multerOptions))
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
