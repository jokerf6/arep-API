import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { OrderStatus } from '@prisma/client';
import { LanguagesService } from 'src/_modules/languages/languages.service';
@Injectable()
export class HelpersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, // Assuming languages is injected or available
  ) {}
  async getServiceById(id: Id) {
    const store = await this.prisma.store.findUnique({
      where: {
        id,
      },
    });
    if (!store) throw new NotFoundException('store not found');
    return store;
  }
  async canUserRate(userId: Id, storeId: Id) {
    const isUserRated = await this.prisma.storeRating.findUnique({
      where: {
        storeId_userId: {
          storeId,
          userId,
        },
      },
    });
    if (isUserRated)
      throw new BadRequestException('You have already rated this service');
    const order = await this.prisma.order.findMany({
      where: {
        Service:{
          storeId
        },
        userId,
      },
      select: {
        status: true,
      },
    });
    if (!order?.length)
      throw new BadRequestException('You have not ordered this service');
    const completedStatus = order.find(
      (o) => o.status === OrderStatus.COMPLETED,
    );
    if (!completedStatus)
      throw new BadRequestException(
        'Your Order to this service is not completed',
      );
  }
  async getRatingById(id: Id, userId: Id) {
    const rating = await this.prisma.storeRating.findUnique({
      where: {
        id,
      },
      select:{
        id:true,
        rating:true,
        userId:true,
        Store:{
          select:{
            rating:true,
            review:true
          }
        }
      }
    });
    if(!rating) throw new NotFoundException('Rating not found');
    if(rating.userId!==userId) throw new BadRequestException('You can`t access this rating');
    return rating;
  }
}
