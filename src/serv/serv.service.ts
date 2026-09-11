import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateServDto } from './dto/create-serv.dto';
import { UpdateServDto } from './dto/update-serv.dto';

import { Serv, ServDocument } from './serv.schema';

@Injectable()
export class ServService {
  constructor(
    @InjectModel(Serv.name)
    private servModel: Model<ServDocument>,
  ) {}
  create(createServDto: CreateServDto) {
    const createdServ = new this.servModel(createServDto);
    return createdServ.save();
  }

  findAll(): Promise<Serv[]> {
    return this.servModel.find().exec();
  }

  findOne(id: string) {
    return this.servModel.findById(id).exec();
  }

  update(id: string, updateServDto: UpdateServDto) {
    return this.servModel
      .findByIdAndUpdate(id, updateServDto, { returnDocument: 'after' })
      .exec();
  }

  remove(id: string) {
    return this.servModel.findByIdAndDelete(id).exec();
  }
}
