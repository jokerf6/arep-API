// prisma/seeds/notificationSettings.ts
import { Banner, PrismaClient } from '@prisma/client';

export async function seedBanner(prisma: PrismaClient) {
  const count = await prisma.banner.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data: Banner = {
      id: i,
      name: { en: `Banner ${i}`, ar: `البانر ${i}` },
      image: `https://example.com/banner${i}`,
      active: true,
      randomSeed: Math.random(),
      storeId: 1,
      createdAt: new Date(),
      deletedAt: null,
    };
    await prisma.banner.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Banner seeded');
}
