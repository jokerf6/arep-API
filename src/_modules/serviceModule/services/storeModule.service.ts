import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { LanguagesService } from '../../languages/languages.service';
import { CreateServiceDTO, FilterServiceDTO, UpdateServiceDTO } from '../dto/service.dto';
import { getServiceArgs, getServiceArgsWithSelect } from '../prisma-args/service.prisma.args';
import { ServiceModuleHelper } from './serviceModule.helper.service';
import { calcPriceAfterDiscount } from 'src/globals/helpers/discountCalc.helper';
@Injectable()
export class ServiceModuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language: LanguagesService,
    private readonly helper: ServiceModuleHelper
  ) {}
async create(body:CreateServiceDTO,){
  const {Variants,...data}=body
  const priceAfterDiscount=calcPriceAfterDiscount(data.discount,data.discountType,data.price);
  await this.prisma.$transaction(async(tx)=>{
 const service=await tx.service.create({
    data: {
      ...data,
      priceAfterDiscount,

    },
  });
   for (const variant of Variants) {
      const { Options, ...variantData } = variant;

      await tx.variation.create({
        data: {
          ...variantData,
          serviceId: service.id,
          VariationOption: {
            create: Options.map((option) => ({
              ...option,
            })),
          },
        },
      });
    }
  });
 
}
  async findAll(filters: FilterServiceDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getServiceArgs(filters, languages);
    const argsWithSelect = getServiceArgsWithSelect();

    const services = await this.prisma.service[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    const data = this.helper.mapServices(Array.isArray(services) ? services : [services]);

    return data;
  }

  async count(filters: FilterServiceDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getServiceArgs(filters, languages);
    const total = await this.prisma.service.count({ where: args.where });

    return total;
  }
async update(id:Id,body:UpdateServiceDTO){
   const {Variants,...data}=body
  const priceAfterDiscount=calcPriceAfterDiscount(data.discount,data.discountType,data.price);
  await this.prisma.$transaction(async(tx)=>{
 const service=await tx.service.update({
  where:{id},
    data: {
      ...data,
      priceAfterDiscount,

    },
  });
  await tx.variationOption.deleteMany({
    where:{
      Variation:{
        serviceId:id
      }
    }
  })
  await tx.variation.deleteMany({
    where:{
      serviceId:id
    }
  })
  if(Variants?.length){
  for (const variant of Variants) {
      const { Options, ...variantData } = variant;

      await tx.variation.create({
        data: {
          ...variantData,
          serviceId: service.id,
          VariationOption: {
            create: Options.map((option) => ({
              ...option,
            })),
          },
        },
      });
    }
  }
 
  });
}
  async delete(id:Id){
 await this.prisma.service.delete({
  where:{
    id
  }
})
}
}
