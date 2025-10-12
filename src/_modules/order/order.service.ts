import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { LanguagesService } from '../languages/languages.service';
import { CreateOrderDTO } from './dto/order.dto';
import { HelpersService } from './services/helpers.service';
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, 
    private readonly helpers: HelpersService
  ) {}
  async create(data: CreateOrderDTO) {
    const {userId,addressId,serviceId,variantOptionIds,couponCode,date,quantity}=data;
    await this.helpers.validateUserAddress(userId,addressId);
   const service= await this.helpers.validateServiceAvailability(serviceId,date);
   const selectedVariants= await this.helpers.validateVariants(serviceId,variantOptionIds,quantity);
   const totalPrice=(service.priceAfterDiscount+selectedVariants.totalPrice)*quantity
    const {totalAfterDiscount,discountValue,couponId}=await this.helpers.verifyCoupon(couponCode,userId,service.storeId,totalPrice);
    const {commission,priceAfterCommission}=await this.helpers.getCommission(totalAfterDiscount,service.Store.commission);
    const {tax,priceAfterTax}=await this.helpers.getTax(priceAfterCommission,service.Store.tax);
    await this.prisma.$transaction(async(tx)=>{
      const order=await tx.order.create({
        data:{
          price:totalPrice,
          note:data.note,
          couponId,
          date,
          addressId,
          userId,
          quantity,
          totalPriceAfterDiscount:priceAfterTax,
          discountAmount:discountValue,
          adminCommission:commission,
          serviceId,
          tax
        }
      })
if (variantOptionIds?.length) {
  for (const variant of selectedVariants.variants) {
    await tx.orderVariation.create({
      data: {
        orderId: order.id,
        variationId: variant.variantId,
        OrderVariationOptions: {
          create: variant.selectedOptions.map((option) => ({
            variationOptionId: option.id,
          })),
        },
      },
    });
  }
}
    })
  }
}
