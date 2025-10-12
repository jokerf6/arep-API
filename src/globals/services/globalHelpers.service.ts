import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Days, PrismaClient } from '@prisma/client';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
import { validatePermissions } from '../helpers/validatePermissions.helper';
import { PrismaService } from './prisma.service';

@Injectable()
export class GlobalHelpers {
  constructor(private prisma: PrismaService) {}
  async canUserAccessResource(
    user: CurrentUser,
    modelName: keyof PrismaClient,
    prefix: string,
    resourceId: Id,
    ownerFieldName: string = 'userId',
    ownerCurrentUserField: string = 'id',
    indirectRelation?: boolean,
  ) {
    if (user?.Role?.roleKey === RolesKeys.ADMIN) return true;
    const resource = await this.prisma[modelName as string].findUnique({
      where: { id: resourceId },
    });

    if (!resource) {
      throw new NotFoundException('Resource not found');
    }
    const hasPermission = validatePermissions(
      `${prefix}_manage`,
      user.permissions as any[],
    );

    if (
      resource?.[ownerFieldName] !== user?.[ownerCurrentUserField] &&
      !hasPermission &&
      !indirectRelation
    ) {
      throw new ForbiddenException('You do not have access to this resource');
    }
    if (indirectRelation) {
      const userModel = await this.prisma.user.findUnique({
        where: {
          id: user.id,
        },
      });
      if (!userModel) {
        throw new ForbiddenException('You do not have access to this resource');
      }
      if (userModel?.[`${String(modelName)}Id`] !== resourceId) {
        throw new ForbiddenException('You do not have access to this resource');
      }
    }

    return true;
  }
  async getServiceSchedule(
    serviceId: number,
    date: Date, // 👈 new parameter
  ): Promise<
    {
      day: Days;
      openingClosingTimes: { openingTime: Date; closingTime: Date }[];
      slots: {
        from: Date;
        to: Date;
        status: 'BOOKED' | 'AVAILABLE';
      }[];
    }[]
  > {
    if (date < new Date())
      throw new BadRequestException('Date cannot be in the past');
    const store = await this.prisma.store.findFirst({
      where: {
        Services: {
          some: { id: serviceId },
        },
      },
      select: {
        StoreSchedule: {
          select: {
            day: true,
            openingTime: true,
            closingTime: true,
          },
        },
        Services: {
          where: { id: serviceId },
          select: {
            availableFrom: true,
            availableTo: true,
            durationMinutes: true,
          },
        },
      },
    });

    if (!store || !store.Services?.length)
      throw new NotFoundException('Service or store not found');

    const service = store.Services[0];
    const { availableFrom, availableTo, durationMinutes } = service;

    const availableStart = new Date(availableFrom);
    const availableEnd = new Date(availableTo);

    // 🗓️ Normalize date to start and end of the given day
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);

    const dayEnd = new Date(dayStart);
    dayEnd.setHours(23, 59, 59, 999);

    // 🔍 Fetch all booked orders for this service on the given day
    const bookedOrders = await this.prisma.order.findMany({
      where: {
        serviceId,
        deletedAt: null,
        cancelledAt: null,
        date: {
          gte: dayStart,
          lte: dayEnd,
        },
      },
      select: {
        date: true,
      },
    });

    const bookedTimes = bookedOrders.map((o) => new Date(o.date));

    const result: {
      day: Days;
      openingClosingTimes: { openingTime: Date; closingTime: Date }[];
      slots: { from: Date; to: Date; status: 'BOOKED' | 'AVAILABLE' }[];
    }[] = [];

    for (const schedule of store.StoreSchedule) {
      const storeOpen = new Date(schedule.openingTime);
      const storeClose = new Date(schedule.closingTime);

      // Overlap between service availability and store schedule
      const start = storeOpen < availableStart ? availableStart : storeOpen;
      const end = storeClose > availableEnd ? availableEnd : storeClose;
      if (start >= end) continue;

      const openingClosingTimes = [{ openingTime: start, closingTime: end }];

      const slots: { from: Date; to: Date; status: 'BOOKED' | 'AVAILABLE' }[] =
        [];
      let current = new Date(start);

      while (current < end) {
        const next = new Date(current.getTime() + durationMinutes * 60000);
        if (next > end) break;
        // 🔒 Check if slot is booked for this date
        const isBooked = bookedTimes.some((booked) => {
          return (
            booked.getUTCHours() === current.getUTCHours() &&
            booked.getUTCMinutes() === current.getUTCMinutes() &&
            booked.getUTCSeconds() === current.getUTCSeconds()
          );
        });

        slots.push({
          from: new Date(current),
          to: new Date(next),
          status: isBooked ? 'BOOKED' : 'AVAILABLE',
        });

        current = next;
      }

      const existing = result.find((r) => r.day === schedule.day);
      if (existing) {
        existing.openingClosingTimes.push(...openingClosingTimes);
        existing.slots.push(...slots);
      } else {
        result.push({
          day: schedule.day,
          openingClosingTimes,
          slots,
        });
      }
    }

    return result;
  }
}
