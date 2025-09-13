import {  Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateTransactionDTO, FilterTransactionDTO } from '../dto/transaction.dto';

@Injectable()
export class TransactionService {
  constructor(
    private readonly prisma: PrismaService,
  ) {}

  async createTransaction(data:CreateTransactionDTO) {
    await this.prisma.$transaction(async (prisma) => {
      const lastTransaction = await prisma.transaction.findFirst({
        where: { customerId: data.customerId },
        select: { balance: true },
        orderBy: { createdAt: 'desc' },
        take: 1,
      });

      const lastBalance = lastTransaction?.balance || 0.0;
      data.balance = +lastBalance + +data.credit - +data.debit;

      await prisma.transaction.create({ data });
    });
  }

 
  // async findAll(
  //   locale: Locale,
  //   filters: FilterTransactionDTO,
  // ): Promise<Transaction[]> {
  //   const args = getTransactionArgs(filters);
  //   const data = await this.prisma.transaction[firstOrMany(filters?.id)]({
  //     ...args,
  //   });

  //   return localizedObject(data, locale) as Transaction[];
  // }


  // async findStatistic(filters: FilterTransactionDTO) {
  //   const args = getTransactionArgs(filters);
  //   const AllStatistic = await this.prisma.transaction.aggregate({
  //     _sum: {
  //       credit: true,
  //       debit: true,
  //     },
  //     where: args.where,
  //   });
  //   const statistics = await Promise.all(
  //     Object.values(TransactionType).map(async (type) => {
  //       const result = await this.prisma.transaction.aggregate({
  //         _sum: {
  //           credit: true,
  //         },
  //         where: {
  //           ...args.where,
  //           type,
  //         },
  //       });

  //       return {
  //         type,
  //         totalCredit: result._sum.credit || 0,
  //       };
  //     }),
  //   );
  //   return {
  //     FundStatistics: statistics,
  //     AllStatistic,
  //   };
  // }


  // async findTotalTransactions(filters: FilterTransactionDTO): Promise<number> {
  //   const args = getTransactionArgs(filters);

  //   const total = await this.prisma.transaction.count({ ...args });
  //   return total;
  // }


}
