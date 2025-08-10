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
      name: `Store ${i}`,
      image: `https://example.com/banner${i}`,
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
