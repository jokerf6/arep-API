// prisma/seeds/notificationSettings.ts
import { Category, PrismaClient, Service } from '@prisma/client';

export async function seedSubcategory(prisma: PrismaClient) {
  const count = await prisma.category.count({
    where: {
        parentId:{
            not: null
        }
    },
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data: Category = {
      id: i,
      name: {en: `Subcategory ${i}`, ar: `فئة فرعية ${i}`},
      image: `uploads/subcategory-image-${i}.png`,
      createdAt: new Date(),
      deletedAt: null,
      moduleId: 1,
      parentId: 1,
    };
    await prisma.category.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Subcategory seeded');
}
