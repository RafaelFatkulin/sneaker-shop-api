import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseGuards,
  UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

import { Roles } from '../../utils/decorators';
import { ApiAuthorizedOnly, RoleGuard } from '../../utils/guards';
import { SharpPipe } from '../../utils/pipes/sharp.pipe';

import { CreateBrandDto } from './dto/create-brand.dto';
import { BrandsService } from './brands.service';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(private readonly brandsService: BrandsService) {}

  @Get('')
  getAll() {
    return this.brandsService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    await this.checkIsExists(id);

    return this.brandsService.getById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Post('')
  @UseInterceptors(FileInterceptor('logo'))
  async create(
    @Body() data: CreateBrandDto,
    @UploadedFile(new SharpPipe(data.title, 'brands'))
  ) {
    const brand = await this.brandsService.create(data, logo);

    return {
      message: `Brand "${brand.title}" created successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Patch('/:id')
  async update(@Param('id') id: number, @Body() data: CreateBrandDto) {
    await this.checkIsExists(id);

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
    await this.checkIsExists(id);

    const brand = await this.brandsService.delete(id);

    return {
      message: `Brand "${brand.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number): Promise<void> {
    const isExists = await this.brandsService.getById(id);

    if (!isExists) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }
  }
}
