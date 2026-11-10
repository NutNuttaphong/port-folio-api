import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
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
    if (createUserDto.password) {
      createUserDto.password = bcrypt.hashSync(createUserDto.password, 10);
    }
    const createdUser = new this.userModel(createUserDto);
    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().select('-password').exec();
  }

  async findOne(id: string) {
    return this.userModel.findById(id).select('-password').exec();
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
    }
    return this.userModel
      .findByIdAndUpdate(id, updateUserDto, { new: true })
      .select('-password')
      .exec();
  }

  async remove(id: string) {
    return this.userModel.findByIdAndDelete(id).exec();
  }

  async login(loginUserDto: LoginUserDto) {
    const { username, password } = loginUserDto;

    const user = await this.userModel.findOne({ username }).exec();
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const rawPassword = password || '';
    const isBcrypt =
      typeof user.password === 'string' && user.password.startsWith('$2');
    let isPasswordValid = false;

    if (isBcrypt) {
      isPasswordValid = bcrypt.compareSync(rawPassword, user.password);
    } else {
      isPasswordValid = user.password === rawPassword;
      if (isPasswordValid) {
        user.password = bcrypt.hashSync(rawPassword, 10);
        await user.save();
      }
    }

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid password');
    }

    const secret =
      process.env.JWT_SECRET ||
      'portfolio-production-secure-jwt-secret-key-2026';
    const accessToken = jwt.sign(
      { sub: user._id, username: user.username },
      secret,
      { expiresIn: '7d' },
    );

    return {
      message: 'Login successful',
      access_token: accessToken,
      userId: user._id,
      username: user.username,
    };
  }
}
