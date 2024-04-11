import { Injectable } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({
      data: {
        ...createUserDto,
        password: hashSync(createUserDto.password, 10),
        role: createUserDto.role as Role
      }
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users.map((user) => {
      delete user.password;
      return user;
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    delete user.password;

    return user;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        role: updateUserDto.role as Role
      }
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
