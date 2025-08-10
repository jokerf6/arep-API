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
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import {
  CreateBannerDTO,
  FilterBannerDTO,
  UpdateBannerDTO,
} from './dto/banner.dto';
import { BannerService } from './banner.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { selectBannerOBJ } from './prisma-args/banner.prisma.args';
import { CurrentUser } from '../authentication/decorators/current-user.decorator';
import { RolesKeys } from '../authorization/providers/roles';
import { Auth } from '../authentication/decorators/auth.decorator';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';

const prefix = 'banners';

@Controller(prefix)
@ApiTags(tag(prefix))
export class BannerController {
  constructor(
    private readonly service: BannerService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  @UploadFile('image', 'banner', undefined, {
    disallowedTypes: ['image/svg+xml'],
  })
  async create(@Res() res: Response, @Body() body: CreateBannerDTO) {
    await this.service.create(body);
    return this.response.created(res, 'banner created successfully');
  }

  @Patch('/:id')
  @UploadFile('image', 'banner', undefined, {
    disallowedTypes: ['image/svg+xml'],
  })
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateBannerDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'banner updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Banners',
        paginated: true,
        body: [selectBannerOBJ()],
      },
      {
        title: 'Single Banner',
        paginated: false,
        body: selectBannerOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterBannerDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterBannerDTO }) filters: FilterBannerDTO,
    @CurrentUser() currentUser: CurrentUser,
  ) {
    const isCustomer =
      !currentUser || currentUser.Role.roleKey === RolesKeys.CUSTOMER;
    const data = await this.service.findAll(filters, isCustomer);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(
      res,
      'banner fetched successfully',
      { banners: data },
      {
        total,
      },
    );
  }

  @Delete('/:id')
  @Auth({ prefix })
  @ApiRequiredIdParam()
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete banner successfully');
  }
}
