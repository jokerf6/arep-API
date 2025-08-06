import { Prisma, Module, Language } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterModuleDTO } from '../dto/module.dto';

export const getModuleArgs = (
  query: FilterModuleDTO,
  languages: Language[],
) => {
  const { orderBy, page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Module>(filter, 'id'),
    filterJsonKeyWithRawSQL<Module>(filter, 'name', languages),
    filterJsonKeyWithRawSQL<Module>(filter, 'description', languages),
    filterKey<Module>(filter, 'active'),
  ].filter(Boolean) as Prisma.ModuleWhereInput[];
  const orderArray = [orderKey('order', 'order', orderBy)].filter(
    Boolean,
  ) as Prisma.ModuleOrderByWithRelationInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
    orderBy: orderArray,
  } as Prisma.ModuleFindManyArgs;
};

export const selectModuleOBJ = () => {
  const selectArgs: Prisma.ModuleSelect = {
    id: true,
    name: true,
    description: true,
    image: true,
    active: true,
    order: true,
    createdAt: true,
  };
  return selectArgs;
};
export const getModuleArgsWithSelect = () => {
  return {
    select: selectModuleOBJ(),
  } satisfies Prisma.ModuleFindManyArgs;
};
