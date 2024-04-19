import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { User } from '@prisma/client';
import { Request } from 'express';

import { Roles } from '../../utils/decorators';
import { CurrentUser } from '../../utils/decorators/current-user.decorator';
import { ApiAuthorizedOnly, RoleGuard } from '../../utils/guards';
import { AuthService } from '../../utils/services';
import { PasswordService } from '../../utils/services/auth/common/password';

import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { LoginResponse, RegisterResponse, SessionResponse } from './responses';
import { UserWithoutPassword } from './types';
import { UsersService } from './users.service';

@ApiTags('💂‍♂️ users')
@Controller('users')
// @UseInterceptors(CurrentUserInterceptor)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly passwordService: PasswordService,
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

  @Post('/register')
  @ApiOperation({ summary: 'Регистрация' })
  @ApiResponse({
    status: 201,
    description: 'register',
    type: RegisterResponse
  })
  async register(@Body() registerDto: RegisterDto): Promise<RegisterResponse> {
    const isUserExists = await this.usersService.getByEmail(registerDto.email);

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.createUser(registerDto);

    const { token } = this.authService.register(user);

    return {
      token,
      user: UserWithoutPassword.fromUser(user)
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
  // @UseGuards(RoleGuard)
  // @Roles('ADMIN')
  @ApiBearerAuth()
  async session(@Req() request: Request): Promise<SessionResponse> {
    const token = request.headers.authorization.split(' ')[1];

    const decodedJwtAccessToken = this.authService.decode(token) as UserWithoutPassword;

    const user = await this.usersService.getById(decodedJwtAccessToken.id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      user: UserWithoutPassword.fromUser(user)
    };
  }

  @ApiAuthorizedOnly()
  @Get('')
  @ApiOperation({ summary: 'Пользователи' })
  @ApiResponse({
    status: 200,
    description: 'get all users',
    type: Array<UserWithoutPassword>
  })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  getAllUsers() {
    return this.usersService.getAll();
  }

  @ApiAuthorizedOnly()
  @Post('/create')
  @ApiOperation({ summary: 'Создание пользователя' })
  @ApiResponse({
    status: 201,
    description: 'create user',
    type: UserWithoutPassword
  })
  @Roles('ADMIN')
  @ApiBearerAuth()
  async create(@Body() createUserDto: CreateUserDto) {
    const isUserExists = await this.usersService.getByEmail(createUserDto.email);

    if (isUserExists) {
      throw new BadRequestException('User already exists');
    }

    const user = await this.usersService.createUser(createUserDto);

    return {
      user: UserWithoutPassword.fromUser(user)
    };
  }

  @ApiAuthorizedOnly()
  @Get('/:id')
  @ApiOperation({ summary: 'Пользователь' })
  @ApiResponse({
    status: 200,
    description: 'get user by id',
    type: UserWithoutPassword
  })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async getUserById(@Param('id') id: number) {
    const user = await this.usersService.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return UserWithoutPassword.fromUser(user);
  }

  @ApiAuthorizedOnly()
  @Patch('/update-profile')
  @ApiOperation({ summary: 'Редактирование аккаунта' })
  @ApiResponse({
    status: 200,
    description: 'update user account'
  })
  @Roles('USER', 'ADMIN')
  @UseGuards(RoleGuard)
  @ApiBearerAuth()
  async updateProfile(
    @CurrentUser() currentUser: User,
    // @Param('id') id: number,
    @Body() updateUserDto: UpdateUserDto
  ) {
    console.log('gg', currentUser);
    const isUserExists = await this.usersService.getById(currentUser.id);

    if (!isUserExists) {
      throw new NotFoundException(`User with id ${currentUser.id} not found`);
    }

    const user = await this.usersService.update(currentUser.id, {
      ...updateUserDto,
      password: updateUserDto.password
        ? await this.passwordService.hashPassword(updateUserDto.password)
        : updateUserDto.password
    });

    return UserWithoutPassword.fromUser(user);
  }

  @ApiAuthorizedOnly()
  @Patch('/:id')
  @ApiOperation({ summary: 'Редактирование пользователя' })
  @ApiResponse({
    status: 200,
    description: 'update user by id'
  })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async updateUserById(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
    const isUserExists = await this.usersService.getById(id);

    if (!isUserExists) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    const user = await this.usersService.update(id, {
      ...updateUserDto,
      password: updateUserDto.password
        ? await this.passwordService.hashPassword(updateUserDto.password)
        : updateUserDto.password
    });

    return UserWithoutPassword.fromUser(user);
  }

  @ApiAuthorizedOnly()
  @Delete('/:id')
  @ApiOperation({ summary: 'Удаление пользователя' })
  @ApiResponse({
    status: 200,
    description: 'delete user by id'
  })
  @UseGuards(RoleGuard)
  @Roles('ADMIN')
  @ApiBearerAuth()
  async deleteById(@Param('id') id: number) {
    const user = await this.usersService.getById(id);

    if (!user) {
      throw new NotFoundException(`User with id ${id} not found`);
    }

    return this.usersService.delete(id);
  }
}
