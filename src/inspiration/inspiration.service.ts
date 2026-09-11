import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Inspiration, InspirationDocument } from './inspiration.schema';
import { CreateInspirationDto } from './dto/create-inspiration.dto';
import { UpdateInspirationDto } from './dto/update-inspiration.dto';

@Injectable()
export class InspirationService {
  constructor(
    @InjectModel(Inspiration.name)
    private inspirationModel: Model<InspirationDocument>,
  ) {}

  async create(
    createInspirationDto: CreateInspirationDto,
  ): Promise<Inspiration> {
    const createdInspiration = new this.inspirationModel(createInspirationDto);
    return createdInspiration.save();
  }

  findAll(): Promise<Inspiration[]> {
    return this.inspirationModel.find().exec();
  }

  findOne(id: number) {
    return this.inspirationModel.findById(id).exec();
  }

  update(id: number, updateInspirationDto: UpdateInspirationDto) {
    return this.inspirationModel
      .findByIdAndUpdate(id, updateInspirationDto, { new: true })
      .exec();
  }

  remove(id: number) {
    return this.inspirationModel.findByIdAndDelete(id).exec();
  }
}
