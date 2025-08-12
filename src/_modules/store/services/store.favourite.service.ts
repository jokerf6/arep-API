import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
@Injectable()
export class StoreFavouriteService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async update(storeId: Id, customerId: Id) {
    const isFound = await this.prisma.favoriteStore.findUnique({
      where: {
        storeId_customerId: {
          storeId,
          customerId,
        },
      },
    });
    if (isFound) {
      await this.prisma.favoriteStore.delete({
        where: {
          storeId_customerId: {
            storeId,
            customerId,
          },
        },
      });
    } else {
      await this.prisma.favoriteStore.create({
        data: {
          storeId,
          customerId,
        },
      });
    }
  }

}
