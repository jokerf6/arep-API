import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Res,
} from '@nestjs/common';
import {
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  PartialType,
} from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';

import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { isOne } from 'src/globals/helpers/first-or-many';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { StoreRatingService } from './storeRating.service';
import {
  CreateStoreRatingDTO,
  FilterStoreRatingDTO,
  UpdateStoreRatingDTO,
} from './dto/storeRating.dto';
import { selectStoreRatingOBJ } from './prisma-args/storeRating.prisma.args';
import { CurrentUser } from 'src/_modules/authentication/decorators/current-user.decorator';

const prefix = 'storerating';

@Controller(prefix)
@ApiTags(tag(prefix))
export class StoreRatingController {
  constructor(
    private readonly service: StoreRatingService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateStoreRatingDTO) {
    await this.service.create(body);
    return this.response.created(res, 'StoreRating created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateStoreRatingDTO,
    @CurrentUser() user: CurrentUser,
  ) {
    body.userId=user.id;
    await this.service.update(id, body);
    return this.response.created(res, 'StoreRating updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All StoreRatings',
        paginated: true,
        body: [selectStoreRatingOBJ()],
      },
      {
        title: 'Single StoreRating',
        paginated: false,
        body: selectStoreRatingOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterStoreRatingDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterStoreRatingDTO }) filters: FilterStoreRatingDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'StoreRating fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam,@CurrentUser() user: CurrentUser) {
    await this.service.delete(id,user.id);
    return this.response.success(res, 'delete StoreRating successfully');
  }
}
