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

@Controller('serv')
export class ServController {
  constructor(private readonly servService: ServService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  create(
    @Body() createServDto: CreateServDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      createServDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
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
  @UseInterceptors(FileInterceptor('image', { storage: multerStorage }))
  update(
    @Param('id') id: string,
    @Body() updateServDto: UpdateServDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      updateServDto.imageUrl = `http://localhost:3000/uploads/${file.filename}`;
    }
    return this.servService.update(id, updateServDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.servService.remove(id);
  }
}
