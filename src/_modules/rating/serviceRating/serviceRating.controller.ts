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
import { ServiceRatingService } from './serviceRating.service';
import {
  CreateServiceRatingDTO,
  FilterServiceRatingDTO,
  UpdateServiceRatingDTO,
} from './dto/serviceRating.dto';
import { selectServiceRatingOBJ } from './prisma-args/serviceRating.prisma.args';
import { CurrentUser } from 'src/_modules/authentication/decorators/current-user.decorator';

const prefix = 'ServiceRatings';

@Controller(prefix)
@ApiTags(tag(prefix))
export class ServiceRatingController {
  constructor(
    private readonly service: ServiceRatingService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateServiceRatingDTO) {
    await this.service.create(body);
    return this.response.created(res, 'ServiceRating created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateServiceRatingDTO,
    @CurrentUser() user: CurrentUser,
  ) {
    body.userId=user.id;
    await this.service.update(id, body);
    return this.response.created(res, 'ServiceRating updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All ServiceRatings',
        paginated: true,
        body: [selectServiceRatingOBJ()],
      },
      {
        title: 'Single ServiceRating',
        paginated: false,
        body: selectServiceRatingOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterServiceRatingDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterServiceRatingDTO }) filters: FilterServiceRatingDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'ServiceRating fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam,@CurrentUser() user: CurrentUser) {
    await this.service.delete(id,user.id);
    return this.response.success(res, 'delete ServiceRating successfully');
  }
}
