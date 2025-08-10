/* eslint-disable no-console */
// prisma/seeds/index.ts
import { PrismaClient } from '@prisma/client';
import { seedAdmin } from './admin.seed';
import { seedLanguage } from './language.seed';
import {
  seedPermissions,
  seedRolePermissions,
  seedRoles,
} from './permissionAndRoles.seed';
import { seedCustomer } from './customer.seed';
import { seedNotification } from './notification.seed';
import { seedCoupon } from './coupon.seed';
import { seedModule } from './module.seed';
import { seedStore } from './store.seed';
import { seedBanner } from './banner.seed';
import { seedCategory } from './category.seed';

const prisma = new PrismaClient();

async function main() {
  await prisma.$connect();
  await seedLanguage(prisma);
  await seedPermissions(prisma);
  await seedRoles(prisma);
  await seedRolePermissions(prisma);
  await seedAdmin(prisma);
  await seedNotification(prisma);
  await seedModule(prisma);
  await seedCategory(prisma);

  // await seedLanguage(prisma);
  if (process.env.SEED === 'test') {
    await seedCustomer(prisma);
    await seedCoupon(prisma);
    await seedStore(prisma);
    await seedBanner(prisma);
  }
  await prisma.$disconnect();
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
