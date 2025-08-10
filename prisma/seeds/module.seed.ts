// prisma/seeds/notificationSettings.ts
import { PrismaClient } from '@prisma/client';

export async function seedModule(prisma: PrismaClient) {
  const count = await prisma.module.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  const data = [
    {
      name: { en: `Face Care`, ar: `العناية بالبشرة` },
      description: `test`,
      image: 'uploads/67419136_9662754 1.png',
      active: true,
      order: 1,
      createdAt: new Date(),
      deletedAt: null,
    },
    {
      name: { en: `Makeup`, ar: `المكياج` },
      description: `test`,
      image: 'uploads/makeup-brush-transparent-background 1.png',
      active: true,
      order: 2,
      createdAt: new Date(),
      deletedAt: null,
    },
    {
      name: { en: `Spa`, ar: `المساج` },
      description: `test`,
      image: 'uploads/187115319_10749623 1.png',
      active: true,
      order: 3,
      createdAt: new Date(),
      deletedAt: null,
    },
    {
      name: { en: `Manicure`, ar: `العناية بالأظافر` },
      description: `test`,
      image: 'uploads/close-up-red-nail-polish-isolated-white-background 1.png',
      active: true,
      order: 4,
      createdAt: new Date(),
      deletedAt: null,
    },
  ];
  for (let i = 1; i <= data.length; i += 1) {
    await prisma.module.upsert({
      where: {
        id: i,
      },
      create: data[i - 1],
      update: data[i - 1],
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Module seeded');
}
