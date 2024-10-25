import {
  Injectable,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthPayloadDto } from './dto/auth.dto';
import { User } from '../models/user.model';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  // Signup method to create a new user
  async signup({ name, email, password }: AuthPayloadDto) {
    const existingUser = await this.userModel.findOne({ email });
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new this.userModel({
      name,
      email,
      password: hashedPassword,
    });
    await newUser.save();

    const { password: _, ...userWithoutPassword } = newUser.toObject();
    return userWithoutPassword;
  }

  // Validate user and return JWT if valid
  async validateUser({
    email,
    password,
  }: AuthPayloadDto): Promise<{
    message: string;
    access_token: string;
    refresh_token: string;
  }> {
    const user = await this.userModel.findOne({ email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid Password');
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    const access_token = this.jwtService.sign(userWithoutPassword);
    const refresh_token = this.jwtService.sign(userWithoutPassword, {
      expiresIn: '7d',
    });

    return { message: 'Login successful', access_token, refresh_token };
  }

  // Refresh token method
  async refreshToken(
    refresh_token: string,
  ): Promise<{ message: string; access_token: string; refresh_token: string }> {
    const decoded = this.jwtService.verify(refresh_token);
    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    const user = await this.userModel.findById(decoded._id); 
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const { password: _, ...userWithoutPassword } = user.toObject();
    const access_token = this.jwtService.sign(userWithoutPassword);
    const new_refresh_token = this.jwtService.sign(userWithoutPassword, {
      expiresIn: '7d',
    });

    return {
      message: 'Token refreshed successfully',
      access_token,
      refresh_token: new_refresh_token,
    };
  }
}
