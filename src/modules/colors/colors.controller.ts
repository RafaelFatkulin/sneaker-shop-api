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

import { CreateColorDto } from './dto/create-color.dto';
import { UpdateColorDto } from './dto/update-color.dto';
import { ColorsService } from './colors.service';

@ApiTags('Colors')
@Controller('colors')
export class ColorsController {
  constructor(private readonly colorsService: ColorsService) {}

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Post()
  async create(@Body() createColorDto: CreateColorDto) {
    const color = await this.colorsService.create(createColorDto);

    return {
      message: `Color "${color.title}" created successfully`
    };
  }

  @Get()
  findAll() {
    return this.colorsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
    await this.checkIsExists(id);
    return this.colorsService.findById(id);
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Patch(':id')
  async update(@Param('id') id: number, @Body() updateColorDto: UpdateColorDto) {
    await this.checkIsExists(id);

    const color = await this.colorsService.update(id, updateColorDto);

    return {
      message: `Color "${color.title}" updated successfully`
    };
  }

  @ApiAuthorizedOnly()
  @Roles('ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  @Delete(':id')
  async remove(@Param('id') id: number) {
    await this.checkIsExists(id);

    const color = await this.colorsService.remove(id);
    return {
      message: `Size "${color.title}" deleted successfully`
    };
  }

  private async checkIsExists(id: number): Promise<void> {
    const isExists = await this.colorsService.findById(id);

    if (!isExists) throw new NotFoundException(`Color with id ${id} not found`);
  }
}
