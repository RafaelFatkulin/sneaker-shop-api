import { ConflictException, Injectable } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    try {
      const isUserExists = await this.findByEmail(createUserDto.email);

      if (isUserExists) {
        throw new ConflictException('Email address already exists');
      }

      return await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: hashSync(createUserDto.password, 10),
          role: createUserDto.role as Role
        }
      });
    } catch (error) {
      throw error;
    }
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

  async findByEmail(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email
      }
    });

    if (!user) {
      return null;
    }

    delete user.password;

    return user;
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    const user = await this.prisma.user.update({
      where: {
        id
      },
      data: {
        ...updateUserDto,
        role: updateUserDto.role as Role
      }
    });

    delete user.password;

    return user;
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
