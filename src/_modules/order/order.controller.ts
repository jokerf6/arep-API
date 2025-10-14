import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import {
  ApiOkResponse,
  ApiParam,
  ApiQuery,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';

import { OrderStatus } from '@prisma/client';
import { Response } from 'express';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { AttachUserId } from 'src/decorators/api/attachUserIdInterceptor.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { isOne } from 'src/globals/helpers/first-or-many';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { Auth } from '../authentication/decorators/auth.decorator';
import { CurrentUser } from '../authentication/decorators/current-user.decorator';
import {
  CalculateOrderDTO,
  ChangeOrderStatusParam,
  CreateOrderDTO,
  FilterOrderDTO,
} from './dto/order.dto';
import { OrderService } from './order.service';
import { selectOrderOBJ } from './prisma-args/order.prisma.args';
import { OrderStatusCountFilterDTO } from './dto/order.countStatus.filter.dto';

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
  @Patch('/:id/:status')
  @ApiRequiredIdParam()
  @ApiParam({
    name: 'status',
    enum: OrderStatus,
    required: true,
  })
  @Auth({ prefix })
  async changeStatus(
    @Res() res: Response,
    @Param() { status, id }: ChangeOrderStatusParam,
    @CurrentUser() user: CurrentUser,
  ) {
    await this.service.changeStatus(id, status, user);
    return this.response.created(res, 'order created successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Orders',
        paginated: true,
        body: [selectOrderOBJ()],
      },
      {
        title: 'Single Order',
        paginated: false,
        body: selectOrderOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @AttachStoreId()
  @AttachUserId()
  @ApiQuery({ type: PartialType(FilterOrderDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterOrderDTO }) filters: FilterOrderDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'Order fetched successfully', data, {
      total,
    });
  }
   @Get('/calculate/order')
  @Auth({ prefix,})
  async calculateOrder(
    @Res() res: Response,
       @CurrentUser() user: CurrentUser,
@Body() body: CalculateOrderDTO
  ) {
    const data = await this.service.calculateOrder({
      ...body,
      userId:user.id
    });

    return this.response.success(res, 'Order calculation fetched successfully', data, );
  }
   @Get('/statistics/status-count')
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Order Status Counts',
        paginated: true,
        body: [selectOrderOBJ()],
      },
     
    ]),
  )
  @Auth({ prefix,})
  @AttachStoreId()
  @ApiQuery({ type: PartialType(OrderStatusCountFilterDTO) })
  async getOrderStatusCount(
    @Res() res: Response,
    @Filter({ dto: OrderStatusCountFilterDTO }) filters: OrderStatusCountFilterDTO,
  ) {
    const data = await this.service.getOrderStatusCount(filters);

    return this.response.success(res, 'Order Status Counts fetched successfully', data, );
  }
}
