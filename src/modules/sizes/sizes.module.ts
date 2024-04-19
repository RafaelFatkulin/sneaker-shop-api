import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService, PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { SizesController } from './sizes.controller';
import { SizesService } from './sizes.service';

@Module({
  controllers: [SizesController],
  providers: [SizesService, PrismaService, AuthService, JwtService, PasswordService]
})
export class SizesModule {}
