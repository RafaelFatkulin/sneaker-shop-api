import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '../../utils/decorators';
import { ApiAuthorizedOnly, RoleGuard } from '../../utils/guards';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductsService } from './products.service';

@ApiTags('Products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post()
  async create(@Body() createProductDto: CreateProductDto) {
    const product = await this.productsService.create(createProductDto);

    return {
      message: `Product "${product.title}" created successfully`
    };
  }

  @Get()
  getAll() {
    return this.productsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    await this.checkIsExists(id);

    return this.productsService.getById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateProductDto: UpdateProductDto) {
    await this.checkIsExists(id);

    const product = await this.productsService.update(id, updateProductDto);

    return {
      message: `Product "${product.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.checkIsExists(id);

    const product = await this.productsService.remove(id);

    return {
      message: `Product "${product.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number) {
    const isExists = await this.productsService.getById(id);

    if (!isExists) throw new NotFoundException(`Product with id ${id} not found`);
  }
}
