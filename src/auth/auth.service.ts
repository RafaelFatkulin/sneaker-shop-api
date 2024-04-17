import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { verify } from 'argon2';
import type { Response } from 'express';

import type { CreateUserDto } from '../user/dto';
import { UserService } from '../user/user.service';

import type { SignInDto } from './dto';

@Injectable()
export class AuthService {
  REFRESH_TOKEN_EXPIRATION = 1;

  REFRESH_TOKEN_NAME = 'refreshToken';

  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService
  ) {}

  async signIn(signInDto: SignInDto) {
    const user = await this.validateUser(signInDto);
    delete user.password;

    const tokens = this.createTokens(user.id);

    return {
      user,
      ...tokens
    };
  }

  async signUp(signUpDto: CreateUserDto) {
    const isUserExists = await this.userService.getByEmail(signUpDto.email);

    if (isUserExists) {
      throw new ForbiddenException('User already exists');
    }

    const user = await this.userService.create(signUpDto);
    delete user.password;
    user.role = 'USER';

    const tokens = this.createTokens(user.id);

    return {
      user,
      ...tokens
    };
  }

  async getUser(userId: number) {
    const user = await this.userService.getById(userId);
    delete user.password;

    return user;
  }

  async createNewTokens(refreshToken: string) {
    const result: { id: number } = await this.jwtService.verifyAsync(refreshToken);
    if (!result) throw new UnauthorizedException('Invalid refresh token');

    const user = await this.userService.getById(result.id);
    delete user.password;

    const tokens = this.createTokens(user.id);

    return {
      user,
      ...tokens
    };
  }

  private createTokens(userId: number) {
    const data = { id: userId };

    const accessToken = this.jwtService.sign(data, {
      expiresIn: '10s'
    });

    const refreshToken = this.jwtService.sign(data, {
      expiresIn: '7d'
    });

    return {
      accessToken,
      refreshToken
    };
  }

  private async validateUser(signInDto: SignInDto) {
    const user = await this.userService.getByEmail(signInDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const isValid = await verify(user.password, signInDto.password);

    if (!isValid) throw new UnauthorizedException('Invalid credentials');

    return user;
  }

  addRefreshTokenToResponse(response: Response, refreshToken: string) {
    const expiresIn = new Date();
    expiresIn.setDate(expiresIn.getDate() + this.REFRESH_TOKEN_EXPIRATION);

    response.cookie(this.REFRESH_TOKEN_NAME, refreshToken, {
      httpOnly: true,
      domain: 'localhost',
      expires: expiresIn,
      secure: false
    });
  }

  removeRefreshTokenFromResponse(response: Response) {
    response.cookie(this.REFRESH_TOKEN_NAME, '', {
      httpOnly: true,
      domain: 'localhost',
      expires: new Date(0),
      secure: false
    });
  }
}
