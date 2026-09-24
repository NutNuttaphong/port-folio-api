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
import { ServService } from './serv.service';
import { CreateServDto } from './dto/create-serv.dto';
import { UpdateServDto } from './dto/update-serv.dto';

import { multerOptions } from '../common/multer.config';

export interface LocalFile {
  filename: string;
  originalname: string;
}

@Controller('serv')
export class ServController {
  constructor(private readonly servService: ServService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Body() createServDto: CreateServDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      createServDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.servService.create(createServDto);
  }

  @Get()
  findAll() {
    return this.servService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.servService.findOne(id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateServDto: UpdateServDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      updateServDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.servService.update(id, updateServDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servService.remove(id);
  }
}
