
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateCouponDTO,
  FilterCouponDTO,
  UpdateCouponDTO,
} from './dto/coupon.dto';

import { getCouponArgs, getCouponArgsWithSelect } from './prisma-args/coupon.prisma.args';
import { LanguagesService } from '../languages/languages.service';
@Injectable()
export class CouponService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language:LanguagesService
  ) {}

  async create(data: CreateCouponDTO) {
      // Convert title from JSON (class) to plain object if necessary
      await this.prisma.coupon.create({
        data
      });
  }

  async update(id:Id, body: UpdateCouponDTO) {
   
    await this.prisma.coupon.update({ where: { id }, data: body });
   
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
