import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import type { CreateSizeDto } from './dto/create-size.dto';
import type { UpdateSizeDto } from './dto/update-size.dto';

@Injectable()
export class SizesService {
  constructor(private prisma: PrismaService) {}

  async create(createSizeDto: CreateSizeDto) {
    await this.checkSizeToUnique(createSizeDto.title);

    return this.prisma.size.create({
      data: createSizeDto
    });
  }

  getAll() {
    return this.prisma.size.findMany();
  }

  getById(id: number) {
    return this.prisma.size.findUnique({
      where: {
        id
      }
    });
  }

  private findOneByTitle(title: string) {
    return this.prisma.size.findFirst({
      where: {
        title
      }
    });
  }

  async update(id: number, updateSizeDto: UpdateSizeDto) {
    await this.checkSizeToUnique(updateSizeDto.title, id);

    return this.prisma.size.update({
      where: {
        id
      },
      data: updateSizeDto
    });
  }

  private async checkSizeToUnique(title: string, id?: number) {
    const isExist = await this.findOneByTitle(title);

    if (isExist && isExist.id !== id)
      throw new BadRequestException(`Size ${isExist.title} is already exists`);
  }

  remove(id: number) {
    return this.prisma.size.delete({
      where: {
        id
      }
    });
  }
}
