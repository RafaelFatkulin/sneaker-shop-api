import { ConflictException, Injectable, UnprocessableEntityException } from '@nestjs/common';
import type { Role } from '@prisma/client';
import { hashSync } from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';

import type { CreateUserDto } from './dto/create-user.dto';
import type { UpdateUserDto } from './dto/update-user.dto';
import { UserResponse } from './models';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const isUserExists = await this.findByEmail(createUserDto.email);

    if (isUserExists) {
      throw new ConflictException('Email address already exists');
    }

    if (createUserDto.password !== createUserDto.confirmPassword) {
      throw new UnprocessableEntityException('Passwords are not matching.');
    }

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
      return UserResponse.fromUserEntity(user);
    });
  }

  async findOne(id: number) {
    const user = await this.prisma.user.findUnique({
      where: {
        id
      }
    });

    return UserResponse.fromUserEntity(user);
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

    return UserResponse.fromUserEntity(user);
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

    return UserResponse.fromUserEntity(user);
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: {
        id
      }
    });
  }
}
