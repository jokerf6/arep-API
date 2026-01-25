// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';

export async function seedCustomer(prisma: PrismaClient) {

  // eslint-disable-next-line no-console
  console.log('✅ Customer seeded');
}
