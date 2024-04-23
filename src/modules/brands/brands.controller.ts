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
import { SharpService } from '../../utils/services/sharp/sharp.service';

import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { BrandsService } from './brands.service';

@ApiTags('Brands')
@Controller('brands')
export class BrandsController {
  constructor(
    private readonly brandsService: BrandsService,
    private readonly sharpService: SharpService
  ) {}

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
  async create(@Body() data: CreateBrandDto, @UploadedFile() logo: Express.Multer.File) {
    const imagePath = await this.sharpService.createImage({
      type: 'brand',
      title: data.title,
      image: logo
    });

    const brand = await this.brandsService.create(data, imagePath);

    return {
      message: `Brand "${brand.title}" created successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Patch(':id')
  @UseInterceptors(FileInterceptor('logo'))
  async update(
    @Param('id') id: number,
    @UploadedFile() logo: Express.Multer.File | null,
    @Body() data: UpdateBrandDto
  ) {
    const brandToUpdate = await this.checkIsExists(id);

    let imagePath: string | null = null;

    if (logo) {
      imagePath = await this.sharpService.updateImage({
        type: 'brand',
        title: data.title,
        oldImage: brandToUpdate.logo || null,
        image: logo
      });
    } else {
      imagePath = await this.sharpService.updateImage({
        type: 'brand',
        title: data.title,
        oldTitle: brandToUpdate.title,
        oldImage: brandToUpdate.logo || null
      });
    }

    const brand = await this.brandsService.update(id, data, imagePath || brandToUpdate.logo);

    return {
      message: `Brand "${brand.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @Delete(':id')
  async delete(@Param('id') id: number) {
    const brandToDelete = await this.checkIsExists(id);

    await this.sharpService.deleteImage(brandToDelete.logo);

    const brand = await this.brandsService.delete(id);

    return {
      message: `Brand "${brand.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number) {
    const isExists = await this.brandsService.getById(id);

    if (!isExists) {
      throw new NotFoundException(`Brand with id ${id} not found`);
    }

    return isExists;
  }
}
