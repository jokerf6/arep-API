import { BadRequestException, Injectable } from '@nestjs/common';
import { CouponType, DiscountType } from '@prisma/client';
import { PrismaService } from 'src/globals/services/prisma.service';

@Injectable()
export class HelpersService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
async verifyCoupon(couponCode: string,userId:Id,storeId:Id,totalPrice:number){
    const coupon = await this.prisma.coupon.findUnique({
      where: {
        code: couponCode,
      },
      select:{
        id:true,
        type:true,
        startDate:true,
        endDate:true,
        usageCount:true,
        maxUsage:true,
        minOrderAmount:true,
        discountType:true,
        discountValue:true,
        maxDiscountValue:true,
        active:true,
        StoreCoupons:{
            where:{
                storeId
            },
            select:{
                storeId:true
            }
        },
        UserCoupons:{
            where:{
                userId
            },
            select:{
                userId:true
            }
        },
        Orders:{
            where:{
                userId
            }
        }
      },
    });
    if (!coupon) throw new BadRequestException('Coupon not found');
    if(!coupon.active) throw new BadRequestException('Coupon is not active');
if (coupon.startDate > new Date())
  throw new BadRequestException('Coupon has not started yet');

if (coupon.endDate < new Date())
  throw new BadRequestException('Coupon has expired');

if (coupon.usageCount >= coupon.maxUsage)
  throw new BadRequestException('Coupon usage limit has been reached');

if (coupon.minOrderAmount > totalPrice)
  throw new BadRequestException(
'Coupon cannot be used with this order amount',
  );

  switch (coupon.type) {
  case CouponType.USER_WISE:
    if (!coupon?.UserCoupons?.length) throw new BadRequestException('Coupon is not valid for this user');
    break;
      case CouponType.STORE_WISE:
       if (!coupon?.StoreCoupons?.length) throw new BadRequestException('Coupon is not valid for this user');

    break;
      case CouponType.FIRST_ORDER:
        if (coupon?.Orders?.length) throw new BadRequestException('Coupon is not valid for this user');
    break;

  default:
    break
}
let discountValue=0
switch (coupon.discountType) {
  case DiscountType.AMOUNT:
    discountValue = coupon.discountValue;
    break;
  case DiscountType.PERCENTAGE:
     discountValue= totalPrice * coupon.discountValue / 100;
    if(discountValue>coupon.maxDiscountValue) discountValue=coupon.maxDiscountValue;
    break;
    default:
      break
      }
      return {
        totalAfterDiscount:totalPrice-discountValue,
        couponId:coupon.id
      }
}
}
