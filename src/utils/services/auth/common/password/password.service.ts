import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class PasswordService {
  constructor(private jwtService: JwtService) {}

  signJWT<T extends Record<string, unknown>>(payload: T) {
    return this.jwtService.sign(payload);
  }

  async validatePassword(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  }

  async hashPassword(password: string) {
    return bcrypt.hash(password, 10);
  }

  generatePassword(length: number, includeSymbols: boolean = true): string {
    const characters = [
      'abcdefghijklmnopqrstuvwxyz',
      'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
      '0123456789',
      '!@#$%^&*()_-+={}[]|;:./<>,.?'
    ];

    if (!includeSymbols) {
      characters.pop();
    }

    let password = '';
    for (let i = 0; i < length; i++) {
      const characterSet = characters[Math.floor(Math.random() * characters.length)];
      password += characterSet[Math.floor(Math.random() * characterSet.length)];
    }

    return password;
  }
}
