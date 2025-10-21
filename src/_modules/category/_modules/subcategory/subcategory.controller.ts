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
import { ApiOkResponse, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { ApiOptionalIdParam, ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { isOne } from 'src/globals/helpers/first-or-many';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { ResponseService } from 'src/globals/services/response.service';
import {
  CreateSubCategoryDTO,
  FilterSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './dto/subcategory.dto';
import { selectSubCategoryOBJ } from './prisma-args/subcategory.prisma.args';
import { SubCategoryService } from './subcategory.service';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';

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
   @AttachStoreId({
      storeIdOptionalForManagementUser: true
    })
  @UploadFile('image')

  async create(@Res() res: Response, @Body() body: CreateSubCategoryDTO) {
    await this.service.create(body);
    return this.response.created(res, 'subcategory created successfully');
  }
@Patch('/:id')
  @Auth({ prefix })
    @AttachStoreId()

  @UploadFile('image')
  @ApiRequiredIdParam()
  @CanUserAccessModelRowId({
    prefix,
    modelName:'category',
    ownerCurrentUserField:'storeId',
    ownerFieldName:'storeId'

  })
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
  @ApiOptionalIdParam('id')
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
      @CanUserAccessModelRowId({
    prefix,
    modelName:'category',
    ownerCurrentUserField:'storeId',
    ownerFieldName:'storeId'

  })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete subcategory successfully');
  }
}
