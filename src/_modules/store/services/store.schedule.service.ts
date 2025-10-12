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


}