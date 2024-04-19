import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule, PrismaService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [AuthModule],
  providers: [UsersService, JwtService, PrismaService, PasswordService]
})
export class UsersModule {}
