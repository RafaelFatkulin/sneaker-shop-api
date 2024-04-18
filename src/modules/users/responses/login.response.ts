import type { UserWithoutPassword } from '../types';

export class LoginResponse {
  token: string;

  user: UserWithoutPassword;
}
