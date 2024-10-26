import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { AuthService } from '../auth.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET,
    });
  }

  async validate(payload: any) {
    // Check if the refresh token has been revoked
    const isRevoked = await this.authService.isRefreshTokenRevoked(
      payload.refresh_token,
    );
    if (isRevoked) {
      throw new UnauthorizedException('Refresh token has been revoked');
    }

    return { _id: payload._id, email: payload.email };
  }
}
