import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';
import { SharpService } from '../../utils/services/sharp/sharp.service';

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

  async create(data: CreateBrandDto, logoPath: string) {
    await this.checkTitleToUnique(data.title);

    return this.prisma.brand.create({
      data: {
        ...data,
        logo: logoPath
      }
    });
  }

  async update(id: number, data: UpdateBrandDto, logoPath: string | null) {
    await this.checkTitleToUnique(data.title, id);

    return this.prisma.brand.update({
      where: {
        id
      },
      data: {
        ...data,
        logo: logoPath
      }
    });
  }

  async delete(id: number) {
    return this.prisma.brand.delete({
      where: {
        id
      }
    });
  }

  private async checkTitleToUnique(title: string, id?: number) {
    const isAlreadyExists = await this.getByTitle(title);
    if (isAlreadyExists && isAlreadyExists.id !== id) {
      throw new BadRequestException(`Brand "${title}" already exists`);
    }
  }
}
