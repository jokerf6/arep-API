import { Prisma, Language, BankAccount } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterBankAccountDTO } from '../dto/bankAccount.dto';

export const getBankAccountArgs = (
  query: FilterBankAccountDTO,
  languages: Language[],
) => {
  const {  page, limit, ...filter } = query;
  const searchArray = [
    filterKey<BankAccount>(filter, 'id'),
    filterJsonKeyWithRawSQL<BankAccount>(filter, 'accountName', languages),
  ].filter(Boolean) as Prisma.BankAccountWhereInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
  } as Prisma.BankAccountFindManyArgs;
};

export const selectBankAccountOBJ = () => {
  const selectArgs: Prisma.BankAccountSelect = {
    id: true,
    accountName: true,
    bankId: true,
    phone: true,
    ibn: true,
    Bank: true,
  };
  return selectArgs;
};
export const getBankAccountArgsWithSelect = () => {
  return {
    select: selectBankAccountOBJ(),
  } satisfies Prisma.BankAccountFindManyArgs;
};
