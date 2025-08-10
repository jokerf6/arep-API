// prisma/seeds/notificationSettings.ts
import { Coupon, CouponType, DiscountType, PrismaClient } from '@prisma/client';

export async function seedCoupon(prisma: PrismaClient) {
  const count = await prisma.coupon.count({
    where: {},
  });
  if (count > 0) {
    return;
  }
  for (let i = 1; i <= 1; i += 1) {
    const data: Coupon = {
      id: i,
      title: { en: `Coupon ${i}`, ar: ` الخصم ${i}` },
      code: `COUPON${i}`,
      type: CouponType.ALL_USERS,
      discountType: DiscountType.PERCENTAGE,
      discountValue: 10,
      maxUsage: 1,
      usageCount: 0,
      startDate: new Date(),
      endDate: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
      minOrderAmount: 100,
      freeDelivery: false,
      active: true,
      minDiscountValue: 0,
      maxDiscountValue: 100,
      createdAt: new Date(),
      deletedAt: null,
    };
    await prisma.coupon.upsert({
      where: {
        id: i,
      },
      create: data,
      update: data,
    });
  }
  // eslint-disable-next-line no-console
  console.log('✅ Coupon seeded');
}
