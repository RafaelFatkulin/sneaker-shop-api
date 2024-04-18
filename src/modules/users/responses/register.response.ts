import type { UserWithoutPassword } from '../types';

export class RegisterResponse {
  token: string;

  user: UserWithoutPassword;
}
