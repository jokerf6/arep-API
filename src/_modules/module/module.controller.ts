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
import { ApiOptionalIdParam, ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import {
  CreateModuleDTO,
  FilterModuleDTO,
  UpdateModuleDTO,
} from './dto/module.dto';
import { ModuleService } from './module.service';
import { tag } from 'src/globals/helpers/tag.helper';
import { isOne } from 'src/globals/helpers/first-or-many';
import { selectModuleOBJ } from './prisma-args/module.prisma.args';
import { UploadFile } from 'src/decorators/api/upload-file.decorator';

const prefix = 'modules';

@Controller(prefix)
@ApiTags(tag(prefix))
export class ModuleController {
  constructor(
    private readonly service: ModuleService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @UploadFile("image")
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateModuleDTO) {
    await this.service.create(body);
    return this.response.created(res, 'module created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @UploadFile("image")
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateModuleDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'module updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All Modules',
        paginated: true,
        body: [selectModuleOBJ()],
      },
      {
        title: 'Single Module',
        paginated: false,
        body: selectModuleOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterModuleDTO) })
  @ApiOptionalIdParam('id')
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterModuleDTO }) filters: FilterModuleDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'module fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete module successfully');
  }
}
