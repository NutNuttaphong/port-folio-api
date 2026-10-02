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

function parseTags(rawTags: any): string[] {
  if (!rawTags) return [];
  if (Array.isArray(rawTags)) {
    return rawTags.map(String).map((t) => t.trim()).filter(Boolean);
  }
  if (typeof rawTags === 'string') {
    try {
      const parsed = JSON.parse(rawTags);
      if (Array.isArray(parsed)) {
        return parsed.map(String).map((t) => t.trim()).filter(Boolean);
      }
    } catch {
      // Fallback: handle comma-separated or bracketed strings like [a, b]
      return rawTags
        .replace(/^[\[\s]+|[\]\s]+$/g, '')
        .split(',')
        .map((t) => t.replace(/^["'\s]+|["'\s]+$/g, '').trim())
        .filter(Boolean);
    }
  }
  return [];
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
      createProjectDto.imageUrl = `/uploads/${file.filename}`;
    }
    if (createProjectDto.tags !== undefined) {
      createProjectDto.tags = parseTags(createProjectDto.tags);
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
    if (updateProjectDto.tags !== undefined) {
      updateProjectDto.tags = parseTags(updateProjectDto.tags);
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
