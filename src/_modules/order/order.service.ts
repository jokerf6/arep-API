import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { OrderStatus } from '@prisma/client';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { LanguagesService } from '../languages/languages.service';
import { OrderStatusCountFilterDTO } from './dto/order.countStatus.filter.dto';
import {
  CalculateOrderDTO,
  CreateOrderDTO,
  FilterOrderDTO,
} from './dto/order.dto';
import {
  getOrderArgs,
  getOrderArgsWithSelect,
} from './prisma-args/order.prisma.args';
import { getOrderStatusCountFilterArgs } from './prisma-args/orderStatusCountFilter.prisma.args';
import { HelpersService } from './services/helpers.service';
@Injectable()
export class OrderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService,
    private readonly helpers: HelpersService,
  ) {}
  async calculateOrder(data: CalculateOrderDTO) {
    const { serviceId, variantOptionIds, couponCode, quantity, date, userId } =
      data;

    const service = await this.helpers.validateServiceAvailability(
      serviceId,
      date,
    );
    const selectedVariants = await this.helpers.validateVariants(
      serviceId,
      variantOptionIds,
      quantity,
    );
    const totalPrice =
      (service.priceAfterDiscount + selectedVariants.totalPrice) * quantity;
    const { totalAfterDiscount, discountValue, couponId } =
      await this.helpers.verifyCoupon(
        couponCode,
        userId,
        service.storeId,
        totalPrice,
      );
    const { commission, priceAfterCommission } =
      await this.helpers.getCommission(
        totalAfterDiscount,
        service.Store.commission,
      );
    const { tax, priceAfterTax } = await this.helpers.getTax(
      priceAfterCommission,
      service.Store.tax,
    );
    return {
      priceAfterTax,
      discountValue,
      commission,
      tax,
      totalPrice,
      couponId,
      selectedVariants,
    };
  }
  async create(data: CreateOrderDTO) {
    const {
      userId,
      addressId,
      serviceId,
      variantOptionIds,
      date,
      quantity,
    } = data;
    await this.helpers.validateUserAddress(userId, addressId);
    const {
      priceAfterTax,
      discountValue,
      commission,
      tax,
      totalPrice,
      couponId,
      selectedVariants,
    } = await this.calculateOrder(data);
    await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          price: totalPrice,
          note: data.note,
          couponId,
          date,
          addressId,
          userId,
          quantity,
          totalPriceAfterDiscount: priceAfterTax,
          discountAmount: discountValue,
          adminCommission: commission,
          serviceId,
          tax,
        },
      });
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
    });
  }
  async findAll(filters: FilterOrderDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getOrderArgs(filters, languages);
    const argsWithSelect = getOrderArgsWithSelect();

    const data = await this.prisma.order[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterOrderDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getOrderArgs(filters, languages);
    const total = await this.prisma.order.count({ where: args.where });

    return total;
  }
  async changeStatus(id: Id, status: OrderStatus, user: CurrentUser) {
    const order = await this.helpers.getOrderById(id);
    await this.helpers.canUserAccessOrderId(user, order);
    await this.prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });
  }
  async getOrderStatusCount(filters: OrderStatusCountFilterDTO) {
    const languages = await this.languages.getCashedLanguages();
    const count = await this.prisma.order.groupBy({
      by: ['status'],
      ...getOrderStatusCountFilterArgs(filters, languages),
    });
    return count;
  }
}
