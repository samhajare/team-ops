import { IsEmail, IsObject, IsOptional, IsString } from 'class-validator';

export class CreateCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  name: string;

  @IsString()
  password: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, any>;
}

export class LoginCustomerDto {
  @IsEmail()
  email: string;

  @IsString()
  password: string;
}

export class UserCreatedDTO {
  email: string;
  name: string;
  phone?: string;
  metadata?: Record<string, any>;
}
