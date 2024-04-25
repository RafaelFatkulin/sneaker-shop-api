import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @IsNotEmpty()
  brandId: number;

  @IsNumber()
  @IsNotEmpty()
  categoryId: number;
}
