import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateScheduleDTO } from '../dto/store.schedule.dto';
import { SCHEDULE_ERRORS } from '../config/schedule.config';

@Injectable()
export class ScheduleHelpersService {
  constructor(private readonly prisma: PrismaService) {}

async scheduleOverlap(storeId: Id, body: CreateScheduleDTO): Promise<void> {
  const opening = new Date(body.openingTime);
  const closing = new Date(body.closingTime);

  // Compare time part only
  const openMinutes = opening.getHours() * 60 + opening.getMinutes();
  const closeMinutes = closing.getHours() * 60 + closing.getMinutes();

  if (closeMinutes <= openMinutes) {
    throw new BadRequestException(SCHEDULE_ERRORS.INVALID_SCHEDULE);
  }

  // Normalize both to same date (so Prisma can compare correctly)
  const normalizeToDate = (d: Date) => {
    const base = new Date('1970-01-01T00:00:00Z');
    base.setUTCHours(d.getUTCHours(), d.getUTCMinutes(), 0, 0);
    return base;
  };

  const normalizedOpening = normalizeToDate(opening);
  const normalizedClosing = normalizeToDate(closing);

  const exist = await this.prisma.storeSchedule.findFirst({
    where: {
      storeId,
      day: body.day,
      AND: [
        { openingTime: { lt: normalizedClosing } },
        { closingTime: { gt: normalizedOpening } },
      ],
    },
  });

  if (exist) {
    throw new BadRequestException(SCHEDULE_ERRORS.OVERLAPPING_SCHEDULE);
  }
}

}
