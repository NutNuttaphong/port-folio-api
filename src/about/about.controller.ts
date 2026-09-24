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
import { AboutService } from './about.service';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

import { diskStorage } from 'multer';
import { extname } from 'path';

export interface LocalFile {
  filename: string;
  originalname: string;
}

const multerStorage = diskStorage({
  destination: './uploads',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = extname(file.originalname);
    cb(null, `${uniqueSuffix}${ext}`);
  },
});

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  create(
    @Body() createAboutDto: CreateAboutDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      createAboutDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.aboutService.create(createAboutDto);
  }

  @Get()
  findAll() {
    return this.aboutService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.aboutService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  update(
    @Param('id') id: string,
    @Body() updateAboutDto: UpdateAboutDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      updateAboutDto.imageUrl = `/uploads/${file.filename}`;
    }

    return this.aboutService.update(id, updateAboutDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.aboutService.remove(id);
  }
}
