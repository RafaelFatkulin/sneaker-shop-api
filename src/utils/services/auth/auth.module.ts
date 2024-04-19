import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { PrismaService } from '../prisma';

import { jwtOptions, PasswordModule } from './common/password';
import { JwtStrategy } from './common/strategies/jwt.strategy';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.registerAsync(jwtOptions), PasswordModule],
  providers: [JwtStrategy, AuthService, PrismaService],
  exports: [AuthService]
})
export class AuthModule {}
