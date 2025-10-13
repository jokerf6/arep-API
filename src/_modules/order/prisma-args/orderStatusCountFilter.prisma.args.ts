import { Language, Prisma } from '@prisma/client';
import { OrderStatusCountFilterDTO } from '../dto/order.countStatus.filter.dto';

export const getOrderStatusCountFilterArgs = (
  query: OrderStatusCountFilterDTO,
  languages: Language[],
) => {

  return {
    where: {
      AND: [
        {
          Service: {
            storeId: query?.storeId,
          },
        },
        {
          Service: {
            OR: [
              {
                name: {
                  path: '$.ar',
                  string_contains: query?.serviceOrClientName,
                },
              },
              {
                name: {
                  path: '$.en',
                  string_contains: query?.serviceOrClientName,
                },
              },
            ],
          },
        },
        {
            Customer:{
                name:query.serviceOrClientName
            }
        },
        {
            date:{
                gte:query.fromDate,
                lte:query.toDate
            }
        }
      ],
    },
  }
};

export const getOrderStatusCountFilterArgsWithSelect = () => {
  return {} satisfies Prisma.OrderFindManyArgs;
};
