import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateScheduleDTO } from '../dto/store.schedule.dto';
import { Days, StoreSchedule } from '@prisma/client';
@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}
    async createSchedule(
    data: CreateScheduleDTO,
  ): Promise<StoreSchedule> {
    return this.prisma.storeSchedule.create({
      data
    });
  }
    async deleteSchedule(id: Id): Promise<void> {
    await this.prisma.storeSchedule.delete({
      where: {
        id,
      },
    });
  }
async getServiceSchedule(serviceId: number):Promise<{ day: Days; times: { openingTime: Date; closingTime: Date }[] }[]> {
  const store = await this.prisma.store.findFirst({
    where: {
      Services: {
        some: {
          id: serviceId,
        },
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
        where: {
          id: serviceId,
        },
        select: {
          availableFrom: true,
          availableTo: true,
        },
      },
    },
  });
  if (!store||!store?.Services?.length) throw new NotFoundException('Service or store not found');

  const service = store.Services[0];
  const availableFrom = new Date(service.availableFrom);
  const availableTo = new Date(service.availableTo);

  // Group and filter times by service availability
  const groupedSchedules = store.StoreSchedule.reduce(
    (acc, { day, openingTime, closingTime }) => {
      const open = new Date(openingTime);
      const close = new Date(closingTime);

      // Keep slot only if it overlaps service availability window
      const overlapStart = open < availableFrom ? availableFrom : open;
      const overlapEnd = close > availableTo ? availableTo : close;

      // Valid only if overlap window is positive
      if (overlapStart < overlapEnd) {
        const existingDay = acc.find((d) => d.day === day);
        const slot = { openingTime: overlapStart, closingTime: overlapEnd };

        if (existingDay) {
          existingDay.times.push(slot);
        } else {
          acc.push({ day, times: [slot] });
        }
      }

      return acc;
    },
    [] as { day: Days; times: { openingTime: Date; closingTime: Date }[] }[],
  );

  return groupedSchedules;
}

}