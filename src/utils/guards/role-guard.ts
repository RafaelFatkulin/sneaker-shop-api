import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import type { Observable } from 'rxjs';

import { AuthService } from '../services';

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private authService: AuthService
  ) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<string[]>('roles', context.getHandler());
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];
    const user = this.authService.decode(token);

    if (!user) {
      throw new ForbiddenException('You are not allowed to activate');
    }

    const hasRole = roles.includes(user?.role);
    console.log(request.url, roles, user.role);
    if (!hasRole) {
      throw new ForbiddenException('You are not allowed to activate');
    }

    return true;
  }
}
