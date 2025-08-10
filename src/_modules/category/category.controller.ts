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
import {
  ApiOkResponse,
  ApiOperation,
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
import {
  CreateCategoryDTO,
  FilterCategoryDTO,
  UpdateCategoryDTO,
} from './dto/category.dto';
import { CategoryService } from './category.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { selectCategoryOBJ } from './prisma-args/category.prisma.args';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';

const prefix = 'categories';

@Controller(prefix)
@ApiTags(tag(prefix))
export class CategoryController {
  constructor(
    private readonly service: CategoryService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @ApiOperation({ deprecated: true })
  @Auth({ prefix })
  @UploadFile('image')
  async create(@Res() res: Response, @Body() body: CreateCategoryDTO) {
    await this.service.create(body);
    return this.response.created(res, 'category created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @UploadFile('image')
  @ApiOperation({ deprecated: true })
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateCategoryDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'category updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Categories',
        paginated: true,
        body: [selectCategoryOBJ()],
      },
      {
        title: 'Single Category',
        paginated: false,
        body: selectCategoryOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterCategoryDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterCategoryDTO }) filters: FilterCategoryDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'category fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiOperation({ deprecated: true })
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete category successfully');
  }
}
