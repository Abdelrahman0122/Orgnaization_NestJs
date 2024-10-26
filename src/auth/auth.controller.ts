import { Body, Controller, Post, Req, UseGuards, UnauthorizedException } from '@nestjs/common';
import { AuthPayloadDto } from './dto/auth.dto';
import { AuthService } from './auth.service'; 
import { Request } from 'express';
import { JwtAuthGuard } from './guards/jwt.guard';
import { LocalGuard } from './guards/local.guard';
import { User } from '../models/user.model';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() authPayloadDto: AuthPayloadDto) {
    return this.authService.signup(authPayloadDto);
  } 

  @Post('login')
  @UseGuards(LocalGuard)
  login(@Req() req: Request) {
    return req.user;
  }

  @Post('refresh-token')
  async refreshToken(@Body() body: { refresh_token: string }) { 
    return this.authService.refreshToken(body.refresh_token);
  }

  @Post('revoke-refresh-token')
  @UseGuards(JwtAuthGuard)
  async revokeRefreshToken(
  @Req() req: Request,
    @Body() body: { refresh_token: string }
  ) {
    const userId = (req.user as User)?._id; 

    if (!userId) {
      throw new UnauthorizedException('User not authenticated');
    }

    await this.authService.revokeRefreshToken(body.refresh_token);
    return { message: 'Refresh token revoked successfully' };
  }
}
