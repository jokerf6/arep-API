import { Prisma } from "@prisma/client";

export const selectOrderByIdForValidationOBJ = () => {
  const selectArgs: Prisma.OrderSelect = {
      id:true,
           status:true,
           Service:{
             select:{
               storeId:true
             }
           }
      }
  return selectArgs;
};

export type selectOrderByIdForValidationOBJType = Prisma.OrderGetPayload<{
  select: ReturnType<typeof selectOrderByIdForValidationOBJ>;
}>;