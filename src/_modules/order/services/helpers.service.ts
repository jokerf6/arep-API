import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import {
  Coupon,
  CouponType,
  DiscountType,
  Order,
  ServiceStatus,
} from '@prisma/client';
import { GlobalHelpers } from 'src/globals/services/globalHelpers.service';
import { PrismaService } from 'src/globals/services/prisma.service';
import {
  selectCouponOBJ,
  SelectCouponObjType,
} from '../prisma-args/coupon.prisma.args';
import { validatePermissions } from 'src/globals/helpers/validatePermissions.helper';
import { selectOrderByIdForValidationOBJ, selectOrderByIdForValidationOBJType } from '../prisma-args/order.helpers.prisma.arg';

@Injectable()
export class HelpersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly globalHelpers: GlobalHelpers,
  ) {}
  async verifyCoupon(
    couponCode: string,
    userId: Id,
    storeId: Id,
    totalPrice: number,
  ) {
    if (!couponCode)
      return {
        totalAfterDiscount: totalPrice,
        couponId: undefined,
        discountValue: 0,
      };
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code: couponCode,
      },
      select: selectCouponOBJ(storeId, userId),
    });
    this.isCouponValid(coupon, totalPrice);
    return this.extractDiscount(coupon, totalPrice);
  }
  isCouponValid(coupon: SelectCouponObjType, totalPrice: number) {
    if (!coupon) throw new BadRequestException('Coupon not found');
    if (!coupon.active) throw new BadRequestException('Coupon is not active');
    if (coupon.startDate > new Date())
      throw new BadRequestException('Coupon has not started yet');

    if (coupon.endDate < new Date())
      throw new BadRequestException('Coupon has expired');

    if (coupon.usageCount >= coupon.maxUsage)
      throw new BadRequestException('Coupon usage limit has been reached');

    if (coupon.minOrderAmount > totalPrice)
      throw new BadRequestException(
        'Coupon cannot be used with this order amount because of minOrderAmount',
      );

    switch (coupon.type) {
      case CouponType.USER_WISE:
        if (!coupon?.UserCoupons?.length)
          throw new BadRequestException('Coupon is not valid for this user');
        break;
      case CouponType.STORE_WISE:
        if (!coupon?.StoreCoupons?.length)
          throw new BadRequestException('Coupon is not valid for this user');

        break;
      case CouponType.FIRST_ORDER:
        if (coupon?.Orders?.length)
          throw new BadRequestException('Coupon is not valid for this user');
        break;

      default:
        break;
    }
  }
  extractDiscount(coupon: Coupon, totalPrice: number) {
    let discountValue = 0;
    switch (coupon.discountType) {
      case DiscountType.AMOUNT:
        discountValue = coupon.discountValue;
        break;
      case DiscountType.PERCENTAGE:
        discountValue = (totalPrice * coupon.discountValue) / 100;
        if (discountValue > coupon.maxDiscountValue)
          discountValue = coupon.maxDiscountValue;
        break;
      default:
        break;
    }
    return {
      totalAfterDiscount: totalPrice - discountValue,
      couponId: coupon.id,
      discountValue,
    };
  }
  async validateUserAddress(userId: Id, addressId: Id) {
    const address = await this.prisma.address.findUnique({
      where: {
        id: addressId,
        userId,
      },
    });
    if (!address) throw new BadRequestException('Address not found');
  }
  async validateServiceAvailability(serviceId: Id, date: Date) {
    const service = await this.prisma.service.findUnique({
      where: {
        id: serviceId,
      },
      include:{
        Store:true
      }
    });
    if (!service) throw new BadRequestException('Service not found');
    if (service.status !== ServiceStatus.ACTIVE)
      throw new BadRequestException('Service is not active');
    if(service.Store.temporarilyClosed) throw new BadRequestException('Store is temporarily closed');
    await this.isServiceAvailable(serviceId, date);

    return service;
  }
  async isServiceAvailable(serviceId: Id, date: Date) {
    const schedule = await this.globalHelpers.getServiceSchedule(
      serviceId,
      date,
    );
    if (!schedule?.length)
      throw new BadRequestException('Service is not available');

    const dayOfWeek = date
      .toLocaleString('en-US', { weekday: 'long' })
      .toUpperCase();
    const daySchedule = schedule.find((s) => s.day === dayOfWeek);
    if (!daySchedule) throw new BadRequestException('Service is not available');

    const targetTime =
      date.getUTCHours() * 3600 +
      date.getUTCMinutes() * 60 +
      date.getUTCSeconds();

    const isAvailable = daySchedule.slots.some((slot) => {
      const from = new Date(slot.from);
      const to = new Date(slot.to);
      const fromTime =
        from.getUTCHours() * 3600 +
        from.getUTCMinutes() * 60 +
        from.getUTCSeconds();
      const toTime =
        to.getUTCHours() * 3600 + to.getUTCMinutes() * 60 + to.getUTCSeconds();
      return (
        slot.status === 'AVAILABLE' &&
        targetTime >= fromTime &&
        targetTime < toTime
      );
    });
    if (!isAvailable) throw new BadRequestException('Service is not available');
    return true;
  }
async validateVariants(serviceId: Id, variantOptionIds: Id[], quantity: number) {
  const existingVariants = await this.prisma.variation.findMany({
    where: { serviceId },
    select: {
      id: true,
      required: true,
      maxQuantity: true,
      minQuantity: true,
      single: true,
      VariationOption: {
        select: {
          id: true,
          price: true,
          default: true,
        },
      },
    },
  });

  if (!existingVariants.length&&variantOptionIds?.length)
    throw new BadRequestException('No variants found for this service');

  // Flatten all available option IDs
  const allOptionIds = existingVariants.flatMap((v) =>
    v.VariationOption.map((opt) => opt.id),
  );

  // 1️⃣ Validate that all selected options exist
  const invalidOptions = variantOptionIds.filter((id) => !allOptionIds.includes(id));
  if (invalidOptions.length)
    throw new BadRequestException(`Invalid variant options: ${invalidOptions.join(', ')}`);

  // 2️⃣ Group selected options by variant
  const variantSelections = existingVariants.map((variant) => {
    const selectedOptions = variant.VariationOption.filter((opt) =>
      variantOptionIds.includes(opt.id),
    );
    return { ...variant, selectedOptions };
  });

  // 3️⃣ Check required variants (throw if missing)
  const missingRequired = variantSelections.filter(
    (v) => v.required && v.selectedOptions.length === 0,
  );
  if (missingRequired.length)
    throw new BadRequestException(
      `Missing required variants: ${missingRequired.map((v) => v.id).join(', ')}`,
    );

  // 4️⃣ Check single-option variants
  const invalidSingles = variantSelections.filter(
    (v) => v.single && v.selectedOptions.length > 1,
  );
  if (invalidSingles.length)
    throw new BadRequestException(
      `Only one option can be selected for single variants: ${invalidSingles
        .map((v) => v.id)
        .join(', ')}`,
    );

  // 5️⃣ Check quantity constraints
  const invalidQuantities = variantSelections.filter(
    (v) =>
      (v.minQuantity && quantity < v.minQuantity) ||
      (v.maxQuantity && quantity > v.maxQuantity),
  );
  // if (invalidQuantities.length)
  //   throw new BadRequestException(
  //     `Quantity must be between min and max limits for variants: ${invalidQuantities
  //       .map((v) => v.id)
  //       .join(', ')}`,
  //   );

  // 6️⃣ Calculate total price
  let totalPrice = 0;
  for (const variant of variantSelections) {
    for (const option of variant.selectedOptions) {
      totalPrice += option.price;
    }
  }

  // ✅ Return detailed result
  return {
    variants: variantSelections
      .filter((v) => v.selectedOptions.length > 0)
      .map((v) => ({
        variantId: v.id,
        selectedOptions: v.selectedOptions.map((o) => ({
          id: o.id,
          price: o.price,
        })),
      })),
    totalPrice,
  };
}
async getCommission(price:number,storeCommission:number){
const commissionIncluded=await this.prisma.settings.findUnique({
  where:{
    setting:'commissionIncluded'
  }
})
const businessOrderCommissionRateForAll=await this.prisma.settings.findUnique({
  where:{
    setting:'businessOrderCommissionRateForAll'
  }
})
const businessOrderCommissionRate=await this.prisma.settings.findUnique({
  where:{
    setting:'businessOrderCommissionRate'
  }
})
let commissionPercentage=0
if(!businessOrderCommissionRateForAll||businessOrderCommissionRateForAll.value==='false'){
  commissionPercentage=storeCommission  
}else{
commissionPercentage=businessOrderCommissionRate?.value?Number.parseFloat(businessOrderCommissionRate.value):0
}
const commission=(price*commissionPercentage)/100
if(!commissionIncluded||commissionIncluded.value==='false'){
  return {
    commission,
    priceAfterCommission:price+commission
  }
}else{
  return {
    commission,
    priceAfterCommission:price
  }
}
}
async getTax(price:number,storeTaxPercent:number){
  const StoreTaxForAll=await this.prisma.settings.findUnique({
  where:{
    setting:'StoreTaxForAll'
  }
})
const StoreTaxRate=await this.prisma.settings.findUnique({
  where:{
    setting:'StoreTaxRate'
  }
})
const storeTax=(price*storeTaxPercent)/100
if(!StoreTaxForAll||StoreTaxForAll.value==='false'){
  return {
    tax:storeTax,
    priceAfterTax:price+storeTax
  }
}else{
  const settingTaxPercent=StoreTaxRate?.value?Number.parseFloat(StoreTaxRate.value):0
  const settingTax=(price*settingTaxPercent)/100
  return {
    tax:settingTax,
    priceAfterTax:price
  } 
}
}
async getOrderById(id:Id){
  const order=await this.prisma.order.findUnique({
    where:{
      id:id
    },
    select:{
      ...selectOrderByIdForValidationOBJ() 
    }
  })
  return order
}
async canUserAccessOrderId(user:CurrentUser,order:selectOrderByIdForValidationOBJType){
const canUserManageOrder=validatePermissions(
      `orders_manage`,
     user.permissions,
    );
    if(canUserManageOrder){
      return true;
    }
    if(order.Service.storeId===user.storeId){
      return true;
    }
    throw new ForbiddenException('You do not have access to this order');
}
}
