import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { HelpersService } from './services/helpers.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService,HelpersService],
})
export class OrderModule {}
