import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { ApiOkResponse, ApiParam, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { ResponseService } from 'src/globals/services/response.service';

import { Response } from 'express';
import { AttachUserId } from 'src/decorators/api/attachUserIdInterceptor.decorator';
import { tag } from 'src/globals/helpers/tag.helper';
import { Auth } from '../authentication/decorators/auth.decorator';
import { ChangeOrderStatusParam, CreateOrderDTO, FilterOrderDTO } from './dto/order.dto';
import { OrderService } from './order.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { Filter } from 'src/decorators/param/filter.decorator';
import { selectOrderOBJ } from './prisma-args/order.prisma.args';
import { isOne } from 'src/globals/helpers/first-or-many';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { OrderStatus } from '@prisma/client';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';
import { CurrentUser } from '../authentication/decorators/current-user.decorator';

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
      name:'status',
      enum:OrderStatus,
      required:true,
    })
  @Auth({ prefix })
  async changeStatus(@Res() res: Response,@Param() {status,id}: ChangeOrderStatusParam,@CurrentUser() user:CurrentUser) {
    await this.service.changeStatus(id,status,user);
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
  
}
