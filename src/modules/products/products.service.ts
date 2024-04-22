import { BadRequestException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import type { CreateProductDto } from './dto/create-product.dto';
import type { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private prisma: PrismaService) {}

  async create(createProductDto: CreateProductDto) {
    await this.checkProductToUnique(createProductDto.title);

    return this.prisma.product.create({
      data: createProductDto
    });
  }

  getAll() {
    return this.prisma.product.findMany({
      include: {
        brand: {
          select: {
            title: true,
            logo: true
          }
        }
      }
    });
  }

  getById(id: number) {
    return this.prisma.product.findUnique({
      where: {
        id
      },
      include: {
        brand: {
          select: {
            title: true,
            logo: true
          }
        }
      }
    });
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    await this.checkProductToUnique(updateProductDto.title, id);

    return this.prisma.product.update({
      where: {
        id
      },
      data: updateProductDto,
      include: {
        brand: {
          select: {
            title: true,
            logo: true
          }
        }
      }
    });
  }

  remove(id: number) {
    return this.prisma.product.delete({
      where: {
        id
      }
    });
  }

  private findOneBiTitle(title: string) {
    return this.prisma.product.findFirst({
      where: {
        title
      }
    });
  }

  private async checkProductToUnique(title: string, id?: number) {
    const isExist = await this.findOneBiTitle(title);
    if (isExist && isExist.id !== id)
      throw new BadRequestException(`Product ${isExist.title} is already exists`);
  }
}
