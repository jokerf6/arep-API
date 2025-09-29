import { Prisma, Banner, Language } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterBannerDTO } from '../dto/banner.dto';

export const getBannerArgs = (
  query: FilterBannerDTO,
  languages: Language[],
  isCustomer = false,
) => {
  const { page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Banner>(filter, 'id'),
    filterJsonKeyWithRawSQL(filter, 'name', languages),
    filterKey<Banner>(filter, 'storeId'),
    filterKey<Banner>(filter, 'active'),
  ].filter(Boolean) as Prisma.BannerWhereInput[];

  const orderArray = [
    isCustomer && {
      randomSeed: 'desc',
    },
  ].filter(Boolean) as Prisma.BannerOrderByWithRelationInput[];
  return {
    ...paginateOrNot({ limit, page }, query?.id),
    orderBy: orderArray,
    where: {
      AND: searchArray,
    },
  } as Prisma.BannerFindManyArgs;
};

export const selectBannerOBJ = () => {
  const selectArgs: Prisma.BannerSelect = {
    id: true,
    name: true,
    image: true,
    active: true,
    createdAt: true,
    Store: {
      select: {
        id: true,
        name: true,
        logo: true,
        cover: true,
      },
    },
  };
  return selectArgs;
};
export const getBannerArgsWithSelect = () => {
  return {
    select: selectBannerOBJ(),
  } satisfies Prisma.BannerFindManyArgs;
};
