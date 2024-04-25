import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import type { CreateCategoryDto } from './dto/create-category.dto';
import type { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  async create(createCategory: CreateCategoryDto) {
    await this.checkCategoryToUnique(createCategory.title);

    return this.prisma.category.create({ data: createCategory });
  }

  findAll() {
    return this.prisma.category.findMany();
  }

  findById(id: number) {
    return this.prisma.category.findUnique({ where: { id } });
  }

  async update(id: number, updateCategoryDto: UpdateCategoryDto) {
    await this.checkCategoryToUnique(updateCategoryDto.title, id);
    return this.prisma.category.update({
      where: { id },
      data: updateCategoryDto
    });
  }

  remove(id: number) {
    return this.prisma.category.delete({ where: { id } });
  }

  private async checkCategoryToUnique(title: string, id?: number) {
    const isExist = await this.prisma.category.findUnique({ where: { title } });

    if (isExist && isExist.id !== id)
      throw new BadRequestException(`Color ${isExist.title} is already exists`);
  }
}
