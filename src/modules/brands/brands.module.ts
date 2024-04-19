import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService, PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { BrandsController } from './brands.controller';
import { BrandsService } from './brands.service';

@Module({
  controllers: [BrandsController],
  imports: [],
  providers: [BrandsService, PrismaService, AuthService, JwtService, PasswordService]
})
export class BrandsModule {}
