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
import { BankService } from './bank.service';
import {
  CreateBankDTO,
  FilterBankDTO,
  UpdateBankDTO,
} from './dto/bank.dto';
import { selectBankOBJ } from './prisma-args/bank.prisma.args';

const prefix = 'banks';

@Controller(prefix)
@ApiTags(tag(prefix))
export class BankController {
  constructor(
    private readonly service: BankService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateBankDTO) {
    await this.service.create(body);
    return this.response.created(res, 'Bank created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @UploadFile('image')
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateBankDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'Bank updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All banks',
        paginated: true,
        body: [selectBankOBJ()],
      },
      {
        title: 'Single Bank',
        paginated: false,
        body: selectBankOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterBankDTO) })
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterBankDTO }) filters: FilterBankDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'Bank fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete Bank successfully');
  }
}
