import { Controller } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';

import { tag } from 'src/globals/helpers/tag.helper';
import { OrderService } from './order.service';

const prefix = 'orders';

@Controller(prefix)
@ApiTags(tag(prefix))
export class OrderController {
  constructor(
    private readonly service: OrderService,
    private readonly response: ResponseService,
  ) {}
}
