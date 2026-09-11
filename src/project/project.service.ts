import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, ProjectDocument } from '../project.schema';

@Injectable()
export class ProjectService {
  constructor(
    @InjectModel(Project.name) private projectModel: Model<ProjectDocument>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const createdProject = new this.projectModel(createProjectDto);
    return createdProject.save();
  }

  // แก้ไขตรงนี้ เพื่อส่งข้อมูล Array กลับไปให้ React
  async findAll(): Promise<Project[]> {
    return this.projectModel.find().exec();
  }

  findOne(id: string) {
    return this.projectModel.findById(id).exec();
  }
  update(id: string, updateProjectDto: UpdateProjectDto) {
    // เอาตัวแปรมาใส่ใน string เพื่อให้ระบบมองว่า "มีการใช้งานแล้ว"
    return this.projectModel
      .findByIdAndUpdate(id, updateProjectDto, { new: true })
      .exec();
  }
  remove(id: string) {
    return this.projectModel.findByIdAndDelete(id).exec();
  }
}
