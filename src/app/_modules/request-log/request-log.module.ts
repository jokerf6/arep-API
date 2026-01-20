import { Module } from '@nestjs/common';
import { RequestLogController } from './request-log.controller';
import { RequestLogService } from './request-log.service';

@Module({
  controllers: [RequestLogController],
  providers: [RequestLogService],
  exports: [RequestLogService], // Export service if needed elsewhere
})
export class RequestLogModule {}
