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
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { Roles } from '../../utils/decorators';
import { ApiAuthorizedOnly, RoleGuard } from '../../utils/guards';

import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { CategoriesService } from './categories.service';

@ApiTags('Categories')
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createCategoryDto: CreateCategoryDto) {
    const category = await this.categoriesService.create(createCategoryDto);

    return {
      message: `Category "${category.title}" created successfully`
    };
  }

  @Get()
  findAll() {
    return this.categoriesService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    await this.checkIsExists(id);
    return this.categoriesService.findById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateCategoryDto: UpdateCategoryDto) {
    await this.checkIsExists(id);

    const category = await this.categoriesService.update(id, updateCategoryDto);

    return {
      message: `Category "${category.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.checkIsExists(id);

    const category = await this.categoriesService.remove(id);
    return {
      message: `Category "${category.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number): Promise<void> {
    const isExists = await this.categoriesService.findById(id);

    if (!isExists) throw new NotFoundException(`Category with id ${id} not found`);
  }
}
