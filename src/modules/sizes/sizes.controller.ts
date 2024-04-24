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

import { CreateSizeDto } from './dto/create-size.dto';
import { UpdateSizeDto } from './dto/update-size.dto';
import { SizesService } from './sizes.service';

@ApiTags('Sizes')
@Controller('sizes')
export class SizesController {
  constructor(private readonly sizesService: SizesService) {}

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createSizeDto: CreateSizeDto) {
    const size = await this.sizesService.create(createSizeDto);

    return {
      message: `Size "${size.title}" created successfully`
    };
  }

  @Get()
  getAll() {
    return this.sizesService.getAll();
  }

  @Get(':id')
  async getById(@Param('id') id: number) {
    await this.checkIsExists(id);

    return this.sizesService.getById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateSizeDto: UpdateSizeDto) {
    await this.checkIsExists(id);

    const size = await this.sizesService.update(id, updateSizeDto);

    return {
      message: `Size "${size.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.checkIsExists(id);

    const size = await this.sizesService.remove(id);
    return {
      message: `Size "${size.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number): Promise<void> {
    const isExists = await this.sizesService.getById(id);

    if (!isExists) throw new NotFoundException(`Size with id ${id} not found`);
  }
}
