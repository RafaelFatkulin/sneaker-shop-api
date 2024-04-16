import { Injectable } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { hash } from 'argon2';

import { PrismaService } from '../common/prisma/prisma.service';

import type { CreateUserDto, UpdateUserDto } from './dto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  getById(id: number) {
    return this.prisma.user.findUnique({
      where: {
        id
      }
    });
  }

  getByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: {
        email
      }
    });
  }

  getAll() {
    return this.prisma.user.findMany();
  }

  async create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: await hash(createUserDto.password),
        role: createUserDto.role as Role
      }
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        password: await hash(updateUserDto.password),
        role: updateUserDto.role as Role
      },
      select: {
        name: true,
        email: true
      }
    });
  }
}
