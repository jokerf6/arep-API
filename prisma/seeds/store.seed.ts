// prisma/seeds/notificationSettings.ts
import { PrismaClient, Store } from '@prisma/client';

export async function seedStore(prisma: PrismaClient) {
  const count = await prisma.store.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data: Store = {
      id: i,
      name: {en: `Store ${i}`, ar: `متجر ${i}`},
      logo: `uploads/store-logo-${i}.png`,
      cover: `https://example.com/banner${i}`,
      address: `Address ${i}`,
      lat: 0,
      lng: 0,
      rating: 0,
      review: 0,
      closed: true,
      temporarilyClosed: false,
      phone: `123-456-7890`,
      status: 'NOT_VERIFIED',
      moduleId: 1,
      planId: 1,
      cityId: 1,
      createdAt: new Date(),
      deletedAt: null,
    };
    await prisma.store.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Store seeded');
}
