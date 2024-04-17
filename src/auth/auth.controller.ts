import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { CreateUserDto } from '../user/dto';

import { Auth } from './decorators/auth.decorator';
import { CurrentUser } from './decorators/current-user.decorator';
import { AuthService } from './auth.service';
import { SignInDto } from './dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('/signin')
  async signIn(@Body() signInDto: SignInDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...data } = await this.authService.signIn(signInDto);
    this.authService.addRefreshTokenToResponse(response, refreshToken);

    return data;
  }

  @HttpCode(HttpStatus.CREATED)
  @Post('/signup')
  async signUp(@Body() signUpDto: CreateUserDto, @Res({ passthrough: true }) response: Response) {
    const { refreshToken, ...data } = await this.authService.signUp(signUpDto);
    this.authService.addRefreshTokenToResponse(response, refreshToken);

    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Auth()
  @Get('/user')
  async getUser(@CurrentUser('id') id: number) {
    return this.authService.getUser(id);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/refresh-token')
  async getNewTokens(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const refreshTokenFromCookies = request.cookies[this.authService.REFRESH_TOKEN_NAME] as string;

    if (!refreshTokenFromCookies) {
      this.authService.removeRefreshTokenFromResponse(response);
      throw new UnauthorizedException('Refresh token not passed');
    }

    const { refreshToken, ...data } =
      await this.authService.createNewTokens(refreshTokenFromCookies);

    this.authService.addRefreshTokenToResponse(response, refreshToken);

    return data;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/logout')
  async logout(@Res({ passthrough: true }) response: Response) {
    this.authService.removeRefreshTokenFromResponse(response);
    return true;
  }
}
