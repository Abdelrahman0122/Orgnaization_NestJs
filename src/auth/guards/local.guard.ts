import { Injectable, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { AuthPayloadDto } from '../dto/auth.dto';

@Injectable()
export class LocalGuard extends AuthGuard('local') {
  constructor(private authService: AuthService) {
    super();
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const { email, password } = request.body as AuthPayloadDto;

    const token = await this.authService.validateUser({ email, password });
    if (!token) throw new UnauthorizedException('Invalid credentials');

    request.user = token;
    return true;
  }
}
