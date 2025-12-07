import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  @IsString()
  role: 'admin' | 'user';

  @IsString()
  @IsOptional()
  name: string;
}

export class UpdateUserDto {
  @IsEmail()
  email: string;

  @IsOptional()
  password: string;

  @IsString()
  role: 'admin' | 'user';

  @IsString()
  @IsOptional()
  name: string;
}
