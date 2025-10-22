import { Language, Prisma, Service, ServiceStatus, Store } from '@prisma/client';
import { paginateOrNot } from 'src/globals/helpers/pagination-params';
import {
  containsInFields,
  filterJsonKeyWithRawSQL,
  filterKey,
  orderKey,
} from 'src/globals/helpers/prisma-filters';
import { FilterServiceDTO } from '../dto/service.dto';

export const getServiceArgs = (
  query: FilterServiceDTO,
  languages: Language[],
) => {
  const { page, limit, ...filter } = query;
  const searchArray = [
    filterKey<Service>(filter, 'id'),
    filterJsonKeyWithRawSQL<Service>(filter, 'name', languages),
    filterJsonKeyWithRawSQL<Service>(filter, 'description', languages),
    filter.customerId && {
      status: ServiceStatus.ACTIVE,
    },
    filter.moduleId && {
      SubCategory:{
        some: {
          Category: {
            moduleId: filter.moduleId,
          },
        },
      }
    },  
    filterKey<Service>(filter, 'storeId'),

    filter.categoryId && {
      SubCategory: {
        some: {
          Category: {
            id: filter.categoryId,
          },
        },
      },
    },
    filterKey<Service>(filter, 'subCategoryId'),
    filterKey<Service>(filter, 'bestRated'),
    filterKey<Service>(filter, 'mostSeller'),
    filterKey<Service>(filter, 'status'),
   

    filter?.favouriteCustomerId && {
      Favorites: {
        some: {
          customerId: filter?.favouriteCustomerId,
        },
      },
    },
  ].filter(Boolean) as Prisma.ServiceWhereInput[];

  return {
    ...paginateOrNot({ limit, page }, query?.id),
    where: {
      AND: searchArray,
    },
  } as Prisma.ServiceFindManyArgs;
};

export const selectServiceOBJ = () => {
  const selectArgs: Prisma.ServiceSelect = {
    id: true,
    name: true,
    description: true,
    image: true,
    durationMinutes: true,
    availableFrom:true,
    availableTo:true,
    price:true,
    priceAfterDiscount: true,
    discount: true,
    discountType:true,
    status: true,
    totalOrders: true,
    totalAmountSold: true,    
    rating: true,
    review: true,
    bestRated: true,
    mostSeller: true,
    createdAt: true,
  
 
  };
  return selectArgs;
};
export const selectServiceOBJById = () => {
  const selectArgs: Prisma.ServiceSelect = {
   ...selectServiceOBJ(),
   Variation:{
      select:{
        id:true,
        name:true,
        required:true,
        maxQuantity:true,
        minQuantity:true,
        single:true,
        VariationOption:{
          select:{
            name:true,
            price:true,
            default:true
          }
        }
      }
    },
    SubCategory:{
      select:{
        id:true,
        name:true,
        Parent:{
          select:{
            id:true,
            name:true,
            Module:{
              select:{
                id:true,
                name:true
              }
            }  
          },

        }
      }
    },
    Store:{
      select:{
        id:true,
        name:true,
        cover:true,
        logo:true,
        address:true,
        rating:true,
        review:true,
      }
    }
  };
  return selectArgs;
};
export const selectServiceOBJWithFavourite = (customerId: Id,id?:Id) => {
  const selectArgs: Prisma.ServiceSelect = {
    ...(!id?selectServiceOBJ():selectServiceOBJById()),
    Favorites: {
      where: {
        customerId,
      },
    },
  } satisfies Prisma.ServiceSelect & { isFavourite?: { id: Id }[] };
  return selectArgs;
};

export const getServiceArgsWithSelect = (customerId?: Id,id?:Id) => {
  let obj = id?selectServiceOBJById():selectServiceOBJ();
  if (customerId) {
    obj = selectServiceOBJWithFavourite(customerId,id);
  }
  return {
    select: obj,
  } satisfies Prisma.ServiceFindManyArgs;
};
