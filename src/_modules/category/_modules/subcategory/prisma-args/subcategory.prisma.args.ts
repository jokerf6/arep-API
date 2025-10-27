import { Category, Language, Prisma } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterSubCategoryDTO } from '../dto/subcategory.dto';

export const getSubCategoryArgs = (
  query: FilterSubCategoryDTO,
  languages: Language[],
) => {
  const { orderBy, page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Category>(filter, 'id'),
    filterJsonKeyWithRawSQL<Category>(filter, 'name', languages),
    filterKey<Category>(filter, 'parentId'),
    filterKey<Category>(filter, 'moduleId'),
    filterKey<Category>(filter, 'active'),

  ].filter(Boolean) as Prisma.CategoryWhereInput[];

  const orderArray = [orderKey('id', 'id', orderBy)].filter(
    Boolean,
  ) as Prisma.CategoryOrderByWithRelationInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    orderBy: orderArray,
    where: {
      AND: [
        ...searchArray,
        {
          parentId: { not: null },
        },
        {
          Service:{
            some:{
              storeId:query?.storeId
            }
          }
        }
      ],
    },
  } as Prisma.CategoryFindManyArgs;
};

export const selectSubCategoryOBJ = () => {
  const selectArgs: Prisma.CategorySelect = {
    id: true,
    name: true,
    image: true,
    createdAt: true,
    Parent: {
      select: {
        id: true,
        name: true,
      },
    },
  };
  return selectArgs;
};
export const getSubCategoryArgsWithSelect = () => {
  return {
    select: selectSubCategoryOBJ(),
  } satisfies Prisma.CategoryFindManyArgs;
};
