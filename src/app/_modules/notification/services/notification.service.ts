import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { FilterNotificationDTO } from '../dto/notification.dto';
import { getNotificationArgs } from '../prisma-args/notification.prisma-args';
import { CreateNotificationDTO } from '../dto/notification.create.dto';

@Injectable()
export class NotificationService {
  constructor(private readonly prisma: PrismaService) {}

  async findNotification(filters: FilterNotificationDTO) {
    const args = getNotificationArgs(filters);
    const [data, total] = await Promise.all([
      this.prisma.notification.findMany({
        ...args,
      }),
      this.prisma.notification.count({ where: args.where }),
    ]);

    return { data, total };
  }
    async create(data: CreateNotificationDTO) {
      await this.prisma.notification.create({
        data,
      });
    }
  async markAllAsRead(userId: Id) {

    await this.prisma.notification.updateMany({
      where:{
        userId,
        read:false
      },
      data:{
        read:true
      }
    })
  }
  async markNotificationAsRead(id:Id) {
    await this.prisma.notification.update({
      where:{
        id
      },
      data:{
        read:true
      }
    })
  }
}
