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

import { multerOptions } from '../common/multer.config';

export interface LocalFile {
  filename: string;
  originalname: string;
}

@Controller('about')
export class AboutController {
  constructor(private readonly aboutService: AboutService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
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
  @UseInterceptors(FileInterceptor('image', multerOptions))
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
