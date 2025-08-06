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
import { ApiQuery, ApiTags, PartialType, ApiOkResponse } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import {
  CreateSubCategoryDTO,
  FilterSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './dto/subcategory.dto';
import { SubCategoryService } from './subcategory.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { selectSubCategoryOBJ } from './prisma-args/subcategory.prisma.args';

const prefix = 'subcategories';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class SubCategoryController {
  constructor(
    private readonly service: SubCategoryService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  async create(@Res() res: Response, @Body() body: CreateSubCategoryDTO) {
    await this.service.create(body);
    return this.response.created(res, 'subcategory created successfully');
  }

  @Patch('/:id')
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateSubCategoryDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'subcategory updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All SubCategories',
        paginated: true,
        body: [selectSubCategoryOBJ()],
      },
      {
        title: 'Single SubCategory',
        paginated: false,
        body: selectSubCategoryOBJ(),
      },
    ]),
  )
  @ApiQuery({ type: PartialType(FilterSubCategoryDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterSubCategoryDTO }) filters: FilterSubCategoryDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(
      res,
      'subcategory fetched successfully',
      data,
      { total },
    );
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete subcategory successfully');
  }
}
