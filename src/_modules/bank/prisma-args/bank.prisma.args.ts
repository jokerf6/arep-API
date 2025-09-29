import { Prisma, Language, Bank } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterBankDTO } from '../dto/bank.dto';

export const getBankArgs = (
  query: FilterBankDTO,
  languages: Language[],
) => {
  const {  page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Bank>(filter, 'id'),
    filterJsonKeyWithRawSQL<Bank>(filter, 'name', languages),
  ].filter(Boolean) as Prisma.BankWhereInput[];
  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
  } as Prisma.BankFindManyArgs;
};

export const selectBankOBJ = () => {
  const selectArgs: Prisma.BankSelect = {
    id: true,
    name: true,
  };
  return selectArgs;
};
export const getBankArgsWithSelect = () => {
  return {
    select: selectBankOBJ(),
  } satisfies Prisma.BankFindManyArgs;
};
