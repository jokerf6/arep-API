import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/globals/services/prisma.service';
import { FilterRequestLogDTO, RequestLogSortField, SortOrder } from './dto/filter-request-log.dto';

@Injectable()
export class RequestLogService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(filters: FilterRequestLogDTO) {
    const {
      page = 1,
      limit = 10,
      method,
      url,
      statusCode,
      userId,
      ip,
      orderBy = RequestLogSortField.CREATED_AT,
      sortOrder = SortOrder.DESC,
    } = filters;
    console.log(userId);

    const where: Prisma.RequestLogWhereInput = {
      ...(method && method[0] !== '' && { method: { contains: method } }),
      ...(url && url[0] !== '' && { url: { contains: url } }),
      ...(statusCode && statusCode[0] !== '' && { statusCode }),
      ...(userId && userId[0] !== '' && { userId: { contains: userId } }),
      ...(ip && ip[0] !== '' && { ip: { contains: ip } }),
    };

    const [data, total] = await Promise.all([
      this.prisma.requestLog.findMany({
        where,
        take: limit,
        skip: (page - 1) * limit,
        orderBy: {
          [orderBy]: sortOrder,
        },
      }),
      this.prisma.requestLog.count({ where }),
    ]);

    return { data, total, page, limit };
  }

  async findOne(id: number) {
    return this.prisma.requestLog.findUnique({
      where: { id },
    });
  }
}
