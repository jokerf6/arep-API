import { Language, Prisma, Store } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  containsInFields,
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterStoreDTO } from '../dto/store.dto';

export const getStoreArgs = (
  query: FilterStoreDTO,
  languages: Language[],
  stores: Store[],
) => {
  const { orderBy, page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Store>(filter, 'id'),
    filterJsonKeyWithRawSQL<Store>(filter, 'name', languages),
    containsInFields<Store>(['address'], filter?.address),
    filterKey<Store>(filter, 'moduleId'),
    filterKey<Store>(filter, 'lat'),
    filterKey<Store>(filter, 'lng'),
    filterKey<Store>(filter, 'planId'),
    filterKey<Store>(filter, 'cityId'),
    filterKey<Store>(filter, 'rating'),
    filterKey<Store>(filter, 'review'),
    filterKey<Store>(filter, 'closed'),
    filterKey<Store>(filter, 'temporarilyClosed'),
    filterKey<Store>(filter, 'status'),
    stores.length > 0 && {
      id: {
        in: stores.map((store) => store.id),
      },
    },
    filter?.favouriteCustomerId && {
      Favorites: {
        some: {
          customerId: filter?.favouriteCustomerId,
        },
      },
    },
  ].filter(Boolean) as Prisma.StoreWhereInput[];

  const orderArray = [orderKey('id', 'id', orderBy)].filter(
    Boolean,
  ) as Prisma.StoreOrderByWithRelationInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    orderBy: orderArray,
    where: {
      AND: searchArray,
    },
  } as Prisma.StoreFindManyArgs;
};

export const selectStoreOBJ = () => {
  const selectArgs: Prisma.StoreSelect = {
    id: true,
    name: true,
    logo: true,
    cover: true,
    address: true,
    lat: true,
    lng: true,
    rating: true,
    review: true,
    closed: true,
    temporarilyClosed: true,
    phone: true,
    status: true,
    createdAt: true,
    City: {
      select: {
        id: true,
        name: true,
      },
    },
    Plan: {
      select: {
        id: true,
        name: true,
      },
    },
    Module: {
      select: {
        id: true,
        name: true,
      },
    },
  };
  return selectArgs;
};
export const selectStoreOBJWithFavourite = (customerId: Id) => {
  const selectArgs: Prisma.StoreSelect = {
    ...selectStoreOBJ(),
    Favorites: {
      where: {
        customerId,
      },
    },
  } satisfies Prisma.StoreSelect & { isFavourite?: { id: Id }[] };
  return selectArgs;
};

export const getStoreArgsWithSelect = (customerId?: Id) => {
  let obj = selectStoreOBJ();
  if (customerId) {
    obj = selectStoreOBJWithFavourite(customerId);
  }
  return {
    select: obj,
  } satisfies Prisma.StoreFindManyArgs;
};
