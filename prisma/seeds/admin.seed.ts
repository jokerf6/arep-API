// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
export async function seedAdmin(prisma: PrismaClient) {
  const createData = {
    id: 1,
    name: `admin`,
    email: process.env.EMAIL,
    phone: `+966 050999999`,
    roleKey: RolesKeys.CUSTOMER,
    verified: true,
    password: bcrypt.hashSync(process.env.PASSWORD, +process.env.HASH_SALT),
  };

  await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: createData,
    update: {},
  });

  // eslint-disable-next-line no-console
  console.log('✅ Admin seeded');
}
