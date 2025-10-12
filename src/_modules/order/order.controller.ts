import { Body, Controller, Post, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';

import { tag } from 'src/globals/helpers/tag.helper';
import { OrderService } from './order.service';
import { Auth } from '../authentication/decorators/auth.decorator';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { Response } from 'express';
import { CreateOrderDTO } from './dto/order.dto';
import { AttachUserId } from 'src/decorators/api/attachUserIdInterceptor.decorator';

const prefix = 'orders';

@Controller(prefix)
@ApiTags(tag(prefix))
export class OrderController {
  constructor(
    private readonly service: OrderService,
    private readonly response: ResponseService,
  ) {}
   @Post('/')
    @Auth({ prefix })
    @AttachUserId()
    async create(@Res() res: Response, @Body() body: CreateOrderDTO) {
      await this.service.create(body);
      return this.response.created(res, 'order created successfully');
    }
}
