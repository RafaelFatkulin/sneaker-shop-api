import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthService, PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { ColorsController } from './colors.controller';
import { ColorsService } from './colors.service';

@Module({
  controllers: [ColorsController],
  providers: [ColorsService, PrismaService, AuthService, JwtService, PasswordService]
})
export class ColorsModule {}
