import { Prisma, Order, Language } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterOrderDTO } from '../dto/order.dto';

export const getOrderArgs = (
  query: FilterOrderDTO,
  languages: Language[],
) => {
  const { orderBy, page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Order>(filter, 'id'),
    filterKey<Order>(filter, 'status'),
  ].filter(Boolean) as Prisma.OrderWhereInput[];

  const orderArray = [orderKey('id', 'id', orderBy)].filter(
    Boolean,
  ) as Prisma.OrderOrderByWithRelationInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    orderBy: orderArray,
    where: {
      AND: [
        ...searchArray,
        {
          OR:[
            {
              userId:query?.userId
            },
            {
              Service:{
                storeId:query?.storeId
              }
            }
          ]
        }
      ],
    },
  } as Prisma.OrderFindManyArgs;
};

export const selectOrderOBJ = () => {
  const selectArgs: Prisma.OrderSelect = {
    id: true,
    
  };
  return selectArgs;
};
export const getOrderArgsWithSelect = () => {
  return {
    // select: selectOrderOBJ(),
  } satisfies Prisma.OrderFindManyArgs;
};
