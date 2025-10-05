import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Res,
  Delete,
  UseInterceptors,
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
import { AuthStoreInterceptor } from '../interceptors/auth.store.interceptor';
import { UploadMultipleFiles } from 'src/decorators/api/upload-file.decorator';
import { StripFieldsIfNoPermission } from 'src/decorators/api/permissionStripInterceptor.decorator';
import { CanUserAccessModelRowId, CanUserAccessModelRowIdInterceptor } from 'src/decorators/api/CanUserAccessModelRowId.decorator';
import { IpAddress } from 'src/_modules/authentication/decorators/ip.decorator';
import { OTPType, SessionType } from '@prisma/client';
import { OTPService } from 'src/_modules/authentication/services/otp.service';
import { TokenService } from 'src/_modules/authentication/services/jwt.service';

const prefix = 'stores';

@Controller(prefix)
@ApiTags(tag(prefix))
export class StoreController {
  constructor(
    private readonly service: StoreService,
    private readonly response: ResponseService,
    private readonly OTPService: OTPService,
    private readonly tokenService: TokenService,
  ) {}

  @Post('/')
  @UploadMultipleFiles([
    {
      name: 'logo',
      fileType: 'image',
      required: false,
    },
    {
      name: 'cover',
      fileType: 'image',
      required: false,
    },
  ]) 
   async create(@Res() res: Response, @Body() body: CreateStoreDTO,   @IpAddress() ip: string,) {
 const user=   await this.service.create(body);
     await this.OTPService.generateOTP(user.id, OTPType.EMAIL_VERIFICATION);
  const token = 
        await this.tokenService.generateToken(
           user.id,
           ip,
           undefined,
           SessionType.VERIFY,
         )
 return this.response.success(res, 'store created successfully', {
      user,
      token,
    });
  }

  @Patch('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })

     @CanUserAccessModelRowId({
    prefix,
    modelName: 'store',
    indirectRelation:true
   })
 @StripFieldsIfNoPermission({
     prefix,
     restrictedFields:['status'],
     method:'manage'
   })
       @UploadMultipleFiles([
    {
      name: 'logo',
      fileType: 'image',
      required: false,
    },
    {
      name: 'cover',
      fileType: 'image',
      required: false,
    },
  ]) 


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
        body: [{...selectStoreOBJ(), Favorites: [] }],
      },
      {
        title: 'Single Store For Visitors',
        paginated: false,
        body: selectStoreOBJ(),
      },
      {
        title: 'Single Store For Customers',
        paginated: false,
        body: [{...selectStoreOBJ(), Favorites: [] }],
      },
    ]),
  )
  @UseInterceptors(AuthStoreInterceptor)
  @ApiQuery({ type: PartialType(FilterStoreDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterStoreDTO }) filters: FilterStoreDTO,
  ) {
    const {data} = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

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
