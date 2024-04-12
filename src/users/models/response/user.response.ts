import type { User } from '@prisma/client';

export class UserResponse {
  id: number;

  name: string;

  email: string;

  role: string;

  createdAt: Date;

  updatedAt: Date;

  static fromUserEntity(entity: User): UserResponse {
    const response = new UserResponse();

    response.id = entity.id;
    response.name = entity.name;
    response.email = entity.email;
    response.role = entity.role;
    response.createdAt = entity.createdAt;
    response.updatedAt = entity.updatedAt;

    return response;
  }
}
