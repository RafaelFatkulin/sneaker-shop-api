import type { CanActivate } from '@nestjs/common';
import { UseGuards } from '@nestjs/common';

import { ApiAuthGuard } from './api-auth.guard';

// eslint-disable-next-line @typescript-eslint/no-redundant-type-constituents
export const ApiAuthorizedOnly = (...otherGuards: (any | CanActivate)[]) =>
  // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  UseGuards(ApiAuthGuard, ...otherGuards);
