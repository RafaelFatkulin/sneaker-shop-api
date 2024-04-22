import { IsHexColor, IsOptional, IsString } from 'class-validator';

export class UpdateColorDto {
  @IsString()
  @IsOptional()
  title: string;

  @IsString()
  @IsOptional()
  @IsHexColor()
  code: string;
}
