import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { HelpersService } from './services/helpers.service';
import { GlobalHelpers } from 'src/globals/services/globalHelpers.service';

@Module({
  controllers: [OrderController],
  providers: [OrderService,HelpersService,GlobalHelpers],
})
export class OrderModule {}
