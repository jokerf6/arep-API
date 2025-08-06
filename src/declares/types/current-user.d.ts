import { Permission } from '@prisma/client';

declare global {
  interface CurrentUser {
    id: Id;
    jti: string;
    Role: {
      id: Id;
      roleKey: string;
    };
    permissions?: Permission[];
  }
}

export {};
