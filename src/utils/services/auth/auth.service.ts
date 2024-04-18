import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import type { Role } from '@prisma/client';

import { PasswordService } from './common/password';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private passwordService: PasswordService
  ) {}

  register<
    T extends {
      id: number;
      name: string;
      email: string;
      role: Role;
    }
  >(user: T) {
    return this.authenticate(user);
  }

  login<
    T extends {
      id: number;
      name: string;
      email: string;
      role: Role;
    }
  >(user: T) {
    return this.authenticate(user);
  }

  decode(token: string) {
    return this.jwtService.decode(token);
  }

  authenticate<
    T extends {
      id: number;
      name: string;
      email: string;
      role: Role;
    }
  >(user: T) {
    return {
      user,
      token: this.jwtService.sign(user)
    };
  }

  async hashPassword(password: string): Promise<string> {
    return this.passwordService.hashPassword(password);
  }

  async validatePassword(password: string, hash: string): Promise<boolean> {
    return this.passwordService.validatePassword(password, hash);
  }
}
