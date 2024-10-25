import { IsString, IsEmail, MinLength, IsOptional } from 'class-validator';

export class AuthPayloadDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6, { message: 'Password must be at least 6 characters long' })
  password: string;
}
