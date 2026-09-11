import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { User, UserDocument } from './user.shema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('ไม่พบชื่อผู้ใช้งานนี้');
    }

    if (user.password !== password) {
      throw new UnauthorizedException('รหัสผ่านไม่ถูกต้อง');
    }

    return {
      message: 'Login สำเร็จ',
      userId: user._id,
      username: user.username,
    };
  }
}
