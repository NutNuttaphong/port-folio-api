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
import { InspirationService } from './inspiration.service';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';

import { multerOptions } from '../common/multer.config';

export interface LocalFile {
  filename: string;
  originalname: string;
}

@Controller('inspiration')
export class InspirationController {
  constructor(private readonly inspirationService: InspirationService) {}

  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  create(
    @Body() createInspirationDto: CreateInspirationDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      createInspirationDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.inspirationService.create(createInspirationDto);
  }

  @Get()
  findAll() {
    return this.inspirationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.inspirationService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions))
  update(
    @Param('id') id: string,
    @Body() updateInspirationDto: UpdateInspirationDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      updateInspirationDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.inspirationService.update(+id, updateInspirationDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.inspirationService.remove(+id);
  }
}
