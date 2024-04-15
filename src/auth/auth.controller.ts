import { Body, Controller, Get, HttpCode, HttpStatus, Post, Res, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { GetCurrentUser, GetCurrentUserId, Public } from 'src/common/decorators';

import { RefreshTokenGuard } from '../common/guards';
import type { UserResponse } from '../users/models';

import { AuthService } from './auth.service';
import { RefreshTokenDto, SignInDto, SignUpDto } from './dto';
import type { Tokens } from './types';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('/signup')
  @HttpCode(HttpStatus.CREATED)
  signUp(@Body() signUpDto: SignUpDto): Promise<Tokens> {
    return this.authService.signUp(signUpDto);
  }

  @Public()
  @Post('/signin')
  @HttpCode(HttpStatus.OK)
  async signIn(@Body() signInDto: SignInDto): Promise<Tokens> {
    return this.authService.signIn(signInDto);
  }

  @ApiBearerAuth()
  @Post('/logout')
  @HttpCode(HttpStatus.OK)
  logout(@GetCurrentUserId() userId: number): Promise<boolean> {
    return this.authService.logout(userId);
  }

  @ApiBearerAuth()
  @Get('/user')
  @HttpCode(HttpStatus.OK)
  async getCurrentUser(@GetCurrentUserId() userId: number): Promise<UserResponse> {
    return this.authService.getCurrentUser(userId);
  }

  @ApiBearerAuth()
  @Public()
  // @UseGuards(RefreshTokenGuard)
  @Post('/refresh')
  @HttpCode(HttpStatus.OK)
  refreshTokens(
    // @GetCurrentUserId() userId: number,
    @Body() refreshTokenDto: RefreshTokenDto
  ): Promise<Tokens> {
    console.log(refreshTokenDto.refreshToken);
    return this.authService.refreshTokens(refreshTokenDto.refreshToken);
  }
}
