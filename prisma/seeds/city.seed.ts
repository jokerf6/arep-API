// prisma/seeds/notificationSettings.ts
import { City, PrismaClient } from '@prisma/client';

export async function seedCity(prisma: PrismaClient) {
  const count = await prisma.city.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data = {
      id: i,
      name: `City ${i}`,
    };
    await prisma.city.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ City seeded');
}
