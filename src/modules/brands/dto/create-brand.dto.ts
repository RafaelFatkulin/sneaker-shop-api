import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateBrandDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({ example: 'Abibas', description: 'Название' })
  title: string;

  @IsString()
  @IsNotEmpty()
  description: string;
}
