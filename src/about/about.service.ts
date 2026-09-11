import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAboutDto } from './dto/create-about.dto';
import { UpdateAboutDto } from './dto/update-about.dto';

import { About, AboutDocument } from './about.schema';

@Injectable()
export class AboutService {
  constructor(
    // 🔥 2. Inject Model ของ Portfolio
    @InjectModel(About.name)
    private aboutModel: Model<AboutDocument>,
  ) {}

  async create(CreateAboutDto: CreateAboutDto): Promise<About> {
    const createdAbout = new this.aboutModel(CreateAboutDto);
    return createdAbout.save();
  }

  findAll(): Promise<About[]> {
    return this.aboutModel.find().exec();
  }

  findOne(id: string) {
    return this.aboutModel.findById(id).exec();
  }

  update(id: string, updateAboutDto: UpdateAboutDto) {
    return (
      this.aboutModel
        // 🔥 เปลี่ยน new: true เป็น returnDocument: 'after' แบบที่เราเคยแก้เพื่อลด Warning ครับ
        .findByIdAndUpdate(id, updateAboutDto, { returnDocument: 'after' })
        .exec()
    );
  }

  remove(id: string) {
    return this.aboutModel.findByIdAndDelete(id).exec();
  }
}
