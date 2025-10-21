
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateCouponDTO,
  FilterCouponDTO,
  UpdateCouponDTO,
} from './dto/coupon.dto';

import { LanguagesService } from '../languages/languages.service';
import { getCouponArgs, getCouponArgsWithSelect } from './prisma-args/coupon.prisma.args';
@Injectable()
export class CouponService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language:LanguagesService
  ) {}

  async create(body: CreateCouponDTO) {
    const {userId,storeId,...data} = body;
    await this.prisma.$transaction(async (tx) => {
const coupon=  await tx.coupon.create({
        data:{
          ...data,
    
       
        }
      });
      if(storeId){
   
        await tx.storeCoupons.create({
          data:{
            storeId,
            couponId:coupon.id
          }
        })
      }
      if(userId){
    
        await tx.userCoupons.create({
          data:{
            userId,
            couponId:coupon.id
          }
        })
      }
    })
   
  }

  async update(id:Id, body: UpdateCouponDTO) {
    const {userId,storeId,...data} = body;
   
  await this.prisma.$transaction(async (tx) => {
    // ✅ Step 1 — Update coupon main fields
    const coupon = await tx.coupon.update({
      where: { id },
      data,
    });

    // ✅ Step 2 — Handle Store Relation
    // If storeId exists → ensure it is the only related store
    if (storeId) {
      await tx.storeCoupons.deleteMany({ where: { couponId: id } });
      await tx.storeCoupons.create({
        data: { storeId, couponId: id },
      });
    }

    // ✅ Step 3 — Handle User Relation
    if (userId) {
      await tx.userCoupons.deleteMany({ where: { couponId: id } });
      await tx.userCoupons.create({
        data: { userId, couponId: id },
      });
    } 

    return coupon;
  });
}

  async findAll( filters: FilterCouponDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getCouponArgs(filters, languages);
    const argsWithSelect = getCouponArgsWithSelect();

    const data = await this.prisma.coupon[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return  data;
  }

   async count(filters: FilterCouponDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getCouponArgs(filters, languages);
    const total = await this.prisma.coupon.count({ where: args.where });

    return total;
  }


    async delete(id: Id): Promise<void> {
    await this.prisma.coupon.delete({
      where: {
        id,
      },
    });
  }

}
