import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import type { CreateColorDto } from './dto/create-color.dto';
import type { UpdateColorDto } from './dto/update-color.dto';

@Injectable()
export class ColorsService {
  constructor(private prisma: PrismaService) {}

  async create(createColorDto: CreateColorDto) {
    await this.checkColorToUnique(createColorDto.title);

    return this.prisma.color.create({ data: createColorDto });
  }

  findAll() {
    return this.prisma.color.findMany();
  }

  findById(id: number) {
    return this.prisma.color.findUnique({ where: { id } });
  }

  async update(id: number, updateColorDto: UpdateColorDto) {
    await this.checkColorToUnique(updateColorDto.title, id);
    return this.prisma.color.update({
      where: { id },
      data: updateColorDto
    });
  }

  remove(id: number) {
    return this.prisma.color.delete({ where: { id } });
  }

  private async checkColorToUnique(title: string, id?: number) {
    const isExist = await this.prisma.color.findUnique({ where: { title } });

    if (isExist && isExist.id !== id)
      throw new BadRequestException(`Color ${isExist.title} is already exists`);
  }
}
