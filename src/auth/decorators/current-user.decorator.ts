import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import type { User } from '@prisma/client';
import type { Request } from 'express';

export const CurrentUser = createParamDecorator((data: keyof User, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest<Request>();
  console.log(request.user);
  const { user } = request;

  return data ? user[data] : user;
});
