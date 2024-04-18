import { Module } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { AuthModule, PrismaService } from '../../utils/services';

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  controllers: [UsersController],
  imports: [AuthModule],
  providers: [UsersService, JwtService, PrismaService]
})
export class UsersModule {}
