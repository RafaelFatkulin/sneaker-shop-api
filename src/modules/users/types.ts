import type { Role, User } from '@prisma/client';

export class UserWithoutPassword {
  id: number;

  name: string;

  email: string;

  role: Role;

  createdAt: Date;

  updatedAt: Date;

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.role = user.role;
    this.createdAt = user.createdAt;
    this.updatedAt = user.updatedAt;
  }

  static fromUser(user: User): UserWithoutPassword {
    return new UserWithoutPassword(user);
  }
}
