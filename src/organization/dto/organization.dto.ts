import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateOrganizationDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  description: string;
}

export class UpdateOrganizationDto {
  @IsString()
  @IsOptional()
  name?: string; 

  @IsString()
  @IsOptional()
  description?: string;
}

export class InviteUserDto {
  @IsEmail()
  @IsNotEmpty()
  user_email: string;
}
