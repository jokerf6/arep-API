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
import { ApiOptionalIdParam, ApiRequiredIdParam } from 'src/decorators/api/id-params.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { RequiredIdParam } from 'src/dtos/params/id-param.dto';
import { ResponseService } from 'src/globals/services/response.service';

import { UploadFile } from 'src/decorators/api/upload-file.decorator';
import { isOne } from 'src/globals/helpers/first-or-many';
import { buildExamples } from 'src/globals/helpers/generate-example.helper';
import { tag } from 'src/globals/helpers/tag.helper';
import { BankAccountService } from './bankAccount.service';
import {
  CreateBankAccountDTO,
  FilterBankAccountDTO,
  UpdateBankAccountDTO,
} from './dto/bankAccount.dto';
import { selectBankAccountOBJ } from './prisma-args/bankAccount.prisma.args';

const prefix = 'bankAccounts';

@Controller(prefix)
@ApiTags(tag(prefix))
export class BankAccountController {
  constructor(
    private readonly service: BankAccountService,
    private readonly response: ResponseService,
  ) {}

  @Post('/')
  @Auth({ prefix })
  async create(@Res() res: Response, @Body() body: CreateBankAccountDTO) {
    await this.service.create(body);
    return this.response.created(res, 'BankAccount created successfully');
  }

  @Patch('/:id')
  @Auth({ prefix })
  @UploadFile('image')
  @ApiRequiredIdParam()
  async update(
    @Res() res: Response,
    @Param() { id }: RequiredIdParam,
    @Body() body: UpdateBankAccountDTO,
  ) {
    await this.service.update(id, body);
    return this.response.created(res, 'BankAccount updated successfully');
  }
  @Get(['/', '/:id'])
  @ApiOkResponse(
    buildExamples([
      {
        title: 'Get All BankAccounts',
        paginated: true,
        body: [selectBankAccountOBJ()],
      },
      {
        title: 'Single BankAccount',
        paginated: false,
        body: selectBankAccountOBJ(),
      },
    ]),
  )
  @Auth({ prefix, visitor: true })
  @ApiQuery({ type: PartialType(FilterBankAccountDTO) })
  @ApiOptionalIdParam('id')
  async findAll(
    @Res() res: Response,
    @Filter({ dto: FilterBankAccountDTO }) filters: FilterBankAccountDTO,
  ) {
    const data = await this.service.findAll(filters);
    const total = isOne(filters?.id)
      ? undefined
      : await this.service.count(filters);

    return this.response.success(res, 'BankAccount fetched successfully', data, {
      total,
    });
  }

  @Delete('/:id')
  @ApiRequiredIdParam()
  @Auth({ prefix })
  async delete(@Res() res: Response, @Param() { id }: RequiredIdParam) {
    await this.service.delete(id);
    return this.response.success(res, 'delete BankAccount successfully');
  }
}
