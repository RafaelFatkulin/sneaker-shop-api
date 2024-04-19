import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Ivanov Ivan Ivanovich', description: 'ФИО' })
  name: string;

  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({ example: 'test@gmail.com', description: 'Почта' })
  email: string;

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role;
}
