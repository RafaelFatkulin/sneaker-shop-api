import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import * as bcrypt from 'bcrypt';

import { PrismaService } from '../prisma/prisma.service';
import type { UserResponse } from '../users/models';
import { UsersService } from '../users/users.service';

import type { SignInDto, SignUpDto } from './dto';
import type { JwtPayload, Tokens } from './types';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<Tokens> {
    const hashedPassword = await bcrypt.hash(signUpDto.password, 10);

    if (signUpDto.password !== signUpDto.confirmPassword) {
      throw new ForbiddenException("Passwords don't match");
    }

    delete signUpDto.confirmPassword;

    const user = await this.prismaService.user
      .create({
        data: {
          ...signUpDto,
          password: hashedPassword
        }
      })
      .catch((error) => {
        if (error instanceof PrismaClientKnownRequestError) {
          if (error.code === 'P2002') {
            throw new ForbiddenException('Credentials incorrect');
          }
        }
        throw error;
      });

    const tokens = await this.getTokens(user.id, user.email);
    await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

    return tokens;
  }

  async signIn(signInDto: SignInDto): Promise<Tokens> {
    try {
      const user = await this.prismaService.user.findUnique({
        where: {
          email: signInDto.email
        }
      });

      console.log(user);

      if (!user) throw new ForbiddenException('Access denied');

      const passwordMatches = await bcrypt.compare(signInDto.password, user.password);
      if (!passwordMatches) throw new ForbiddenException('Access denied');

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async getCurrentUser(userId: number): Promise<UserResponse> {
    const user = await this.usersService.findOne(userId);

    delete user.hashedRefreshToken;

    return user;
  }

  async logout(userId: number): Promise<boolean> {
    await this.prismaService.user.update({
      where: {
        id: userId,
        hashedRefreshToken: {
          not: null
        }
      },
      data: {
        hashedRefreshToken: null
      }
    });

    return true;
  }

  async refreshTokens(
    // userId: number,
    refreshToken: string
  ): Promise<Tokens> {
    try {
      const verifiedToken: JwtPayload = this.jwtService.verify(refreshToken, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET')
      });

      const user = await this.usersService.findOne(verifiedToken.sub);
      console.log({ user });
      if (!user || !user.hashedRefreshToken) throw new ForbiddenException('Access denied');

      const refreshTokenMatches = await bcrypt.compare(user.hashedRefreshToken, refreshToken);
      if (refreshTokenMatches) throw new ForbiddenException('Access denied');

      const tokens = await this.getTokens(user.id, user.email);
      await this.updateRefreshTokenHash(user.id, tokens.refreshToken);

      return tokens;
    } catch (error) {
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  async updateRefreshTokenHash(userId: number, refreshToken: string): Promise<void> {
    const hash = await bcrypt.hash(refreshToken, 10);

    await this.prismaService.user.update({
      where: {
        id: userId
      },
      data: {
        hashedRefreshToken: hash
      }
    });
  }

  async getTokens(userId: number, email: string): Promise<Tokens> {
    const jwtPayload: JwtPayload = {
      sub: userId,
      email
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('ACCESS_TOKEN_SECRET'),
        expiresIn: '5s'
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: this.configService.get<string>('REFRESH_TOKEN_SECRET'),
        expiresIn: '7d'
      })
    ]);

    return {
      accessToken,
      refreshToken
    };
  }
}
