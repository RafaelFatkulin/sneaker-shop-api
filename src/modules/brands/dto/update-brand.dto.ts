import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateBrandDto {
  @IsString()
  @IsOptional()
  @ApiProperty({ example: 'Abibas', description: 'Название' })
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;
}
