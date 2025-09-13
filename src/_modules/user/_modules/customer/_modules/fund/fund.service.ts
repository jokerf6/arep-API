import { Injectable } from '@nestjs/common';
import { Decimal } from '@prisma/client/runtime/library';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateFundDTO, FilterFundDTO } from './dto/fund.dto';
import { TransactionService } from 'src/_modules/transaction/service/transaction.service';
import { TransactionType } from '@prisma/client';
import { getFundArgs } from './prisma-args/fund.prisma-args';

@Injectable()
export class FundService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly transactionService: TransactionService,
  ) {}
  async create(body: CreateFundDTO) {
    await this.prisma.fund.create({
      data: {
        ...body,
      },
    });
    const data = {
      customerId: body.customerId,
      debit: 0,
      credit: +body.price,
      type: TransactionType.FUND,
    };
    await this.transactionService.createTransaction(data);
  }

 async getAll(filters: FilterFundDTO) {
    const args = getFundArgs(filters);
    const funds = await this.prisma.fund.findMany(args);
    return funds;
  }

   async count(filters: FilterFundDTO) {
      const args = getFundArgs(filters);
      return this.prisma.fund.count({ where: args.where });
    }
}
