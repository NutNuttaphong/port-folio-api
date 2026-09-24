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
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

import { multerOptions } from '../common/multer.config';

export interface LocalFile {
  filename: string;
  originalname: string;
}

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // ==========================================
  // 1. ฟังก์ชัน Create (เพิ่มข้อมูล)
  // ==========================================
  @Post()
  @UseInterceptors(FileInterceptor('image', multerOptions))
  async create(
    @Body() createProjectDto: CreateProjectDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      // ใช้ createProjectDto
      createProjectDto.imageUrl = `/uploads/${file.filename}`;
    }
    // สั่ง projectService.create
    return this.projectService.create(createProjectDto);
  }

  // ==========================================
  // 2. ฟังก์ชัน Get (ดึงข้อมูล)
  // ==========================================
  @Get()
  findAll() {
    return this.projectService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectService.findOne(id);
  }

  // ==========================================
  // 3. ฟังก์ชัน Update (แก้ไขข้อมูล)
  // ==========================================
  @Patch(':id')
  @UseInterceptors(FileInterceptor('image', multerOptions)) // 🔥 ติดอาวุธรับไฟล์ให้ Patch ด้วย
  async update(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
    @UploadedFile() file?: LocalFile,
  ) {
    if (file) {
      // ถ้ามีการส่งรูปใหม่มา ค่อยอัปเดต imageUrl
      updateProjectDto.imageUrl = `/uploads/${file.filename}`;
    }
    return this.projectService.update(id, updateProjectDto);
  }

  // ==========================================
  // 4. ฟังก์ชัน Delete (ลบข้อมูล)
  // ==========================================
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectService.remove(id);
  }
}
