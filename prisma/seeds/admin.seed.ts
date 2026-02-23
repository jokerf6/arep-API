// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
export async function seedAdmin(prisma: PrismaClient) {
  const createData = {
    id: 1,
    name: `admin`,
    email: "admin@admin.com",
    phone: `+966 050999999`,
    roleKey: RolesKeys.ADMIN,
    verified: true,
    password: bcrypt.hashSync("Default@123", +process.env.HASH_SALT),
  };
  const superAdmin = {
    id: 2,
    name: `super admin`,
    email: "super@super.com",
    phone: `+966 0192725145`,
    roleKey: RolesKeys.ADMIN,
    verified: true,
    password: bcrypt.hashSync("Default@123", +process.env.HASH_SALT),
  }; 

  await prisma.user.upsert({
    where: {
      id: 1,
    },
    create: createData,
    update: {
      roleKey: RolesKeys.ADMIN,
    },
  });

  await prisma.user.upsert({
    where: {
      id: 2,
    },
    create: superAdmin,
    update: {
      roleKey: RolesKeys.ADMIN,
    },
  });

  // eslint-disable-next-line no-console
  console.log('✅ Admin seeded');
}
