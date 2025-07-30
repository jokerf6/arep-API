// src/notification-queue/notification-queue.module.ts

import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { NotificationService } from 'src/globals/services/notification.service';
import { PrismaService } from 'src/globals/services/prisma.service';
import { SMSService } from 'src/globals/services/sms.service';
import { EmailService } from 'src/globals/services/email.service';
import { NotificationQueueProcessor } from './notification.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notificationQueue',
    }),
  ],
  providers: [
    NotificationQueueProcessor,
    NotificationService,
    PrismaService,
    SMSService,
    EmailService,
  ],
})
export class NotificationQueueModule {}
