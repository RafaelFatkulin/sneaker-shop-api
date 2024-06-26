import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Ivanov Ivan Ivanovich', description: 'ФИО' })
  name?: string;

  @IsEmail()
  @IsOptional()
  @ApiProperty({ example: 'test@gmail.com', description: 'Почта' })
  email?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty({ example: '********', description: 'Пароль' })
  password?: string;
}
