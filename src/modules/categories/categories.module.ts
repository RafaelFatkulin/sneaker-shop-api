import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService, PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';

@Module({
  controllers: [CategoriesController],
  providers: [CategoriesService, PrismaService, AuthService, JwtService, PasswordService]
})
export class CategoriesModule {}
