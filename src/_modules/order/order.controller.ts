import { Body, Controller, Get, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';

import { Response } from 'express';
import { AttachUserId } from 'src/decorators/api/attachUserIdInterceptor.decorator';
import { tag } from 'src/globals/helpers/tag.helper';
import { Auth } from '../authentication/decorators/auth.decorator';
import { CreateOrderDTO, FilterOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { Filter } from 'src/decorators/param/filter.decorator';
import { selectOrderOBJ } from './prisma-args/order.prisma.args';
import { isOne } from 'src/globals/helpers/first-or-many';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';

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
    @Get(['/', '/:id'])
    @ApiOkResponse(
      buildExamples([
        {
          title: 'Get All Categories',
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
  
}
