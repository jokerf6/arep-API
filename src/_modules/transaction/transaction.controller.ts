import { Body, Controller, Get, Res } from '@nestjs/common';
import { ApiQuery, ApiTags, PartialType } from '@nestjs/swagger';
import { Response } from 'express';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';
import { LocaleHeader } from 'src/_modules/authentication/decorators/locale.decorator';
import { Filter } from 'src/decorators/param/filter.decorator';
import { PrismaService } from 'src/globals/services/prisma.service';
import { ResponseService } from 'src/globals/services/response.service';
import {
  FilterTransactionDTO,
} from './dto/transaction.dto';
import { TransactionService } from './service/transaction.service';
import { tag } from 'src/globals/helpers/tag.helper';

const prefix = 'transaction';

@Controller(prefix)
@ApiTags(tag(prefix))
@Auth({ prefix })
export class TransactionController {
  constructor(
    private readonly service: TransactionService,
    private readonly responses: ResponseService,
  ) {}


  // @Get('/statistics')
  // @ApiQuery({ type: PartialType(FilterTransactionDTO) })
  // async findStatistic(
  //   @Res() res: Response,
  //   @Filter({ dto: FilterTransactionDTO }) filters: FilterTransactionDTO,
  // ) {
  //   const date = await this.service.findStatistic(filters);
  //   return this.responses.success(
  //     res,
  //     'transactions_fetched_successfully',
  //     date
  //   );
  // }


  // @Get('/')
  // @ApiQuery({ type: PartialType(FilterTransactionDTO) })
  // async findAll(
  //   @Res() res: Response,
  //   @LocaleHeader() locale: Locale,
  //   @Filter({ dto: FilterTransactionDTO }) filters: FilterTransactionDTO,
  // ) {
  //   const transactions = await this.service.findAll(locale, filters);
  //   const total = await this.service.findTotalTransactions(filters);

  //   return this.responses.success(
  //     res,
  //     'transactions_fetched_successfully',
  //     transactions,
  //     { total },
  //   );
  // }
}
