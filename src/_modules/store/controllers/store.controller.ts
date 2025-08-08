import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Delete,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import {
  CreateStoreDTO,
  FilterStoreDTO,
  UpdateStoreDTO,
} from '../dto/store.dto';
import { StoreService } from '../services/store.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import {
  selectStoreOBJ,
  selectStoreOBJWithFavourite,
} from '../prisma-args/store.prisma.args';
import { CurrentUser } from 'src/_modules/authentication/decorators/current-user.decorator';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';

const prefix = 'stores';

@Controller(prefix)
@ApiTags(tag(prefix))
export class StoreController {
  constructor(
    private readonly service: StoreService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateStoreDTO) {
    await this.service.create(body);
    return this.response.created(res, 'store created successfully');
  }

  @Patch('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateStoreDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'store updated successfully');
  }
  @Get(['/', '/:id'])
  @Auth({ prefix, visitor: true })
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Stores For Visitors',
        paginated: true,
        body: [selectStoreOBJ()],
      },
      {
        title: 'Get All Stores For Customers',
        paginated: true,
        body: [selectStoreOBJWithFavourite(0)],
      },
      {
        title: 'Single Store For Visitors',
        paginated: false,
        body: selectStoreOBJ(),
      },
      {
        title: 'Single Store For Customers',
        paginated: false,
        body: selectStoreOBJWithFavourite(0),
      },
    ]),
  )
  @ApiQuery({ type: PartialType(FilterStoreDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterStoreDTO }) filters: FilterStoreDTO,
    @CurrentUser() user?: CurrentUser,
  ) {
    let customerId: Id | undefined = undefined;
    if (user.Role.roleKey === RolesKeys.CUSTOMER) {
      customerId = user.id;
    }
    const data = await this.service.findAll(filters, customerId);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters, customerId);

    return this.response.success(res, 'store fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @Auth({ prefix })
  @ApiRequiredIdParam()
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete store successfully');
  }
}
