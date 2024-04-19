import { ForbiddenException, Injectable } from '@nestjs/common';

import { PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { CreateUserDto } from './dto/create-user.dto';
import type { RegisterDto } from './dto/register.dto';
import type { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  fieldsToSelect: {
    id: true;
    name: true;
    email: true;
    role: true;
    createdAt: true;
    updatedAt: true;
    password: false;
  };

  constructor(
    private prisma: PrismaService,
    private passwordService: PasswordService
  ) {}

  async createUser(data: CreateUserDto | RegisterDto) {
    const password =
      data instanceof CreateUserDto ? this.passwordService.generatePassword(8) : data.password;

    return this.prisma.user.create({
      data: {
        ...data,
        role: data instanceof CreateUserDto ? data.role : 'USER',
        password: await this.passwordService.hashPassword(password)
      }
    });
  }

  async getAll() {
    return this.prisma.user.findMany({
      select: this.fieldsToSelect
    });
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
    if (updateUserDto.email) {
      const isEmailUnique = await this.getByEmail(updateUserDto.email);

      if (isEmailUnique) {
        throw new ForbiddenException('Email already in use');
      }
    }

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
