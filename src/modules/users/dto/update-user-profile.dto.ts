import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsOptional, IsString, MinLength } from 'class-validator';

import { UpdateUserDto } from './update-user.dto';

export class UpdateUserProfileDto extends UpdateUserDto {
  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty({ example: '********', description: 'Пароль' })
  oldPassword?: string;

  @IsString()
  @IsOptional()
  @MinLength(8)
  @ApiProperty({ example: '********', description: 'Пароль' })
  password?: string;
}
