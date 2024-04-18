import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';

import { CreateUserDto } from './dto/create-user.dto';
import type { RegisterDto } from './dto/register.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async createUser(data: CreateUserDto | RegisterDto) {
    return this.prisma.user.create({
      data: {
        ...data,
        role: data instanceof CreateUserDto ? data.role : 'USER'
      }
    });
  }

  async getAll() {
    return this.prisma.user.findMany();
  }

  async getById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  async getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: updateUserDto
    });
  }

  async delete(id: number) {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
