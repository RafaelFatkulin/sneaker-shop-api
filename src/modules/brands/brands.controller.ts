import {
  BadRequestException,
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

import { Roles } from '../../utils/decorators';
import { ApiAuthorizedOnly, RoleGuard } from '../../utils/guards';

import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandsService } from './brands.service';

@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('')
  getAll() {
    return this.brandsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    const isExists = await this.brandsService.getById(id);

    if (!isExists) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return this.brandsService.getById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('')
  async create(@Body() data: CreateBrandDto) {
    const brand = await this.brandsService.create(data);

    return {
      message: `Brand "${brand.title}" created successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: CreateBrandDto) {
    const isExists = await this.brandsService.getById(id);

    if (!isExists) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    const brand = await this.brandsService.update(id, data);

    return {
      message: `Brand "${brand.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const brand = await this.brandsService.delete(id);

    return {
      message: `Brand "${brand.title}" deleted successfully`
    };
  }
}
