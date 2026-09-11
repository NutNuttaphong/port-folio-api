import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreatePortfolioDto } from './dto/create-portfolio.dto';
import { UpdatePortfolioDto } from './dto/update-portfolio.dto';
// 🔥 1. นำเข้า Schema ของ Portfolio แทน Project
import { Portfolio, PortfolioDocument } from './portfolio.schema';

@Injectable()
export class PortfolioService {
  constructor(
    // 🔥 2. Inject Model ของ Portfolio
    @InjectModel(Portfolio.name)
    private portfolioModel: Model<PortfolioDocument>,
  ) {}

  // 🔥 3. แก้ชื่อตัวแปรและ Return type ให้เป็นของ Portfolio ทั้งหมด
  async create(createPortfolioDto: CreatePortfolioDto): Promise<Portfolio> {
    const createdPortfolio = new this.portfolioModel(createPortfolioDto);
    return createdPortfolio.save();
  }

  async findAll(): Promise<Portfolio[]> {
    return this.portfolioModel.find().exec();
  }

  findOne(id: string) {
    return this.portfolioModel.findById(id).exec();
  }

  update(id: string, updatePortfolioDto: UpdatePortfolioDto) {
    return (
      this.portfolioModel
        // 🔥 เปลี่ยน new: true เป็น returnDocument: 'after' แบบที่เราเคยแก้เพื่อลด Warning ครับ
        .findByIdAndUpdate(id, updatePortfolioDto, { returnDocument: 'after' })
        .exec()
    );
  }

  remove(id: string) {
    return this.portfolioModel.findByIdAndDelete(id).exec();
  }
}
