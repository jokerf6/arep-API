// prisma/seeds/notificationSettings.ts
import { Category, PrismaClient } from '@prisma/client';

export async function seedCategory(prisma: PrismaClient) {
  const count = await prisma.category.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 4; i += 1) {
    const data1: Category = {
      id: i,
      name: { en: `Static Service`, ar: `مراكز ثابتة` },
      image: `uploads/stylized-building-resembling-fire-station-with-pink-cream-color-scheme 1.png`,
      moduleId: i,
      createdAt: new Date(),
      deletedAt: null,
    };

    const data2: Category = {
      id: i * 4,
      name: { en: `Dynamic Service`, ar: `سيارات متنقلة` },
      image: `uploads/argo-van-isolated-background-3d-rendering-illustration 1.png`,
      moduleId: i,
      createdAt: new Date(),
      deletedAt: null,
    };

    await prisma.category.upsert({
      where: {
        id: i,
      },
      create: data1,
      update: data2,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Category seeded');
}
