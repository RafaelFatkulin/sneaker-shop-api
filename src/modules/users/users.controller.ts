import { Body, Controller, Get, NotFoundException, Post, Req } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ApiHeader, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Request } from 'express';

import { ApiAuthorizedOnly } from '../../utils/guards';
import { AuthService } from '../../utils/services';

import { LoginDto } from './dto/login.dto';
import { LoginResponse, SessionResponse } from './responses';
import { UserWithoutPassword } from './types';
import { UsersService } from './users.service';

@ApiTags('💂‍♂️ users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly authService: AuthService
  ) {}

  @Post('/login')
  @ApiOperation({ summary: 'Логин' })
  @ApiResponse({
    status: 200,
    description: 'login',
    type: LoginResponse
  })
  async login(@Body() loginDto: LoginDto): Promise<LoginResponse> {
    const user = await this.usersService.getByEmail(loginDto.email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const { token } = this.authService.login(user);
    return {
      user: UserWithoutPassword.fromUser(user),
      token
    };
  }

  @ApiAuthorizedOnly()
  @Get('/session')
  @ApiOperation({ summary: 'Сессия' })
  @ApiResponse({
    status: 200,
    description: 'session',
    type: SessionResponse
  })
  async session(@Req() request: Request): Promise<SessionResponse> {
    console.log('asdsad');
    const token = request.headers.authorization.split(' ')[1];
    console.log(token);

    const decodedJwtAccessToken = (await this.authService.decode(token)) as UserWithoutPassword;

    const user = await this.usersService.getById(decodedJwtAccessToken.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: UserWithoutPassword.fromUser(user)
    };
  }
}
