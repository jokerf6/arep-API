import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOkResponse, ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { ServiceModuleService } from '../services/storeModule.service';
import { selectServiceOBJ } from '../prisma-args/service.prisma.args';
import { CreateServiceDTO, FilterServiceDTO, UpdateServiceDTO } from '../dto/service.dto';
import { AuthServiceInterceptor } from '../interceptors/auth.aervice.interceptor';
import { ServiceDTO } from '../interfaces/service.interface';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { AttachStoreId } from 'src/decorators/api/attachStoreIdInterceptor.decorator';
import { StripFieldsIfNoPermission } from 'src/decorators/api/permissionStripInterceptor.decorator';
import { ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { CanUserAccessModelRowId } from 'src/decorators/api/CanUserAccessModelRowId.decorator';

const prefix = 'services';

@Controller(prefix)
@ApiTags(tag(prefix))
export class ServiceModuleController {
  constructor(
    private readonly service: ServiceModuleService,
    private readonly response: ResponseService,
  ) {}

  @Get(['/', '/:id'])
  @Auth({ prefix, visitor: true })
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Services For Visitors',
        paginated: true,
        body: [new ServiceDTO()],
      },
      {
        title: 'Get All Services For Customers',
        paginated: true,
        body: [{...new ServiceDTO(), Favorites: [] }],
      },
      {
        title: 'Single Service For Visitors',
        paginated: false,
        body: new ServiceDTO(),
      },
      {
        title: 'Single Service For Customers',
        paginated: false,
        body: [{...new ServiceDTO(), Favorites: [] }],
      },
    ]),
  )
  @UseInterceptors(AuthServiceInterceptor)
  @ApiQuery({ type: PartialType(FilterServiceDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterServiceDTO }) filters: FilterServiceDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'service fetched successfully', data, {
      total,
    });
  }
 @Post('/')
  @Auth({ prefix })
  @AttachStoreId()
  @UploadFile('image', 'service', )
  async create(@Res() res: Response, @Body() body: CreateServiceDTO) {
    await this.service.create(body);
    return this.response.created(res, 'service created successfully');
  }
   @Patch('/:id')
  @Auth({ prefix })
     @CanUserAccessModelRowId({
    prefix,
    modelName: 'service',
    ownerCurrentUserField:'storeId',
    ownerFieldName:'storeId',
   })
  @ApiRequiredIdParam('id')

  @AttachStoreId()
  @UploadFile('image', 'service', )
  @StripFieldsIfNoPermission({
    prefix,
    restrictedFields:['status']
  })

  
  async update(@Res() res: Response, @Body() body: UpdateServiceDTO,    @Param() { id }: RequiredIdParam,) {
    await this.service.update(id,body);
    return this.response.created(res, 'service updated successfully');
  }
  
}
