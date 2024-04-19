import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import type { CreateBrandDto } from './dto/create-brand.dto';
import type { UpdateBrandDto } from './dto/update-brand.dto';

@Injectable()
export class BrandsService {
  constructor(private prisma: PrismaService) {}

  async getAll() {
    return this.prisma.brand.findMany();
  }

  async getById(id: number) {
    return this.prisma.brand.findUnique({
      where: {
        id
      }
    });
  }

  private async getByTitle(title: string) {
    return this.prisma.brand.findUnique({
      where: {
        title
      }
    });
  }

  async create(data: CreateBrandDto) {
    await this.checkTitleToUnique(data.title);

    return this.prisma.brand.create({
      data
    });
  }

  async update(id: number, data: UpdateBrandDto) {
    await this.checkTitleToUnique(data.title, id);

    return this.prisma.brand.update({
      where: {
        id
      },
      data
    });
  }

  async delete(id: number) {
    return this.prisma.brand.delete({
      where: {
        id
      }
    });
  }

  async checkTitleToUnique(title: string, id?: number) {
    const isAlreadyExists = await this.getByTitle(title);
    if (isAlreadyExists && isAlreadyExists.id !== id) {
      throw new BadRequestException(`Brand "${title}" already exists`);
    }
  }
}
