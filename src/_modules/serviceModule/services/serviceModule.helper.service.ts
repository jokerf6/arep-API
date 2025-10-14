import { PrismaService } from "src/globals/services/prisma.service";
import { CategoryDTO, ModuleDTO, ServiceDTO, StoreDTO, SubCategoryDTO, VariationDTO } from "../interfaces/service.interface";
import { Injectable } from "@nestjs/common";

@Injectable()
export class ServiceModuleHelper {
  constructor(private readonly prisma: PrismaService) {}

  private mapServiceObject = (service: any): ServiceDTO => {
    const moduleDTO: ModuleDTO | null = service.SubCategory?.Parent?.Module
      ? { id: service.SubCategory.Parent.Module.id, name: JSON.stringify(service.SubCategory.Parent.Module.name) }
      : null;

    const categoryDTO: CategoryDTO | null = service.SubCategory?.Parent
      ? {
          id: service.SubCategory.Parent.id,
          name: JSON.stringify(service.SubCategory.Parent.name),
          Module: moduleDTO,
        }
      : null;

    const subCategoryDTO: SubCategoryDTO | null = service.SubCategory
      ? {
          id: service.SubCategory.id,
          name: JSON.stringify(service.SubCategory.name),
        }
      : null;

    const storeDTO: StoreDTO | null = service.Store
      ? {
          id: service.Store.id,
          name: JSON.stringify(service.Store.name),
          cover: service.Store.cover,
          logo: service.Store.logo,
          rating: service.Store.rating,
          review: service.Store.review,
        }
      : null;

    const variationsDTO: VariationDTO[] = Array.isArray(service.Variation)
      ? service.Variation.map((v: any) => ({
          id: v.id,
          name: v.name,
          required: v.required,
          maxQuantity: v.maxQuantity,
          minQuantity: v.minQuantity,
          single: v.single,
          VariationOption: Array.isArray(v.VariationOption)
            ? v.VariationOption.map((vo: any) => ({
                name: vo.name,
                price: vo.price,
                default: vo.default,
              }))
            : [],
        }))
      : [];

    const defaultOptionsPrice = variationsDTO.reduce((acc, variation) => {
      if (variation.required) {
        const defaultOptionPrice = variation.VariationOption
          .filter((opt) => opt.default)
          .reduce((sum, opt) => sum + (opt.price || 0), 0);
        return acc + defaultOptionPrice;
      }
      return acc;
    }, 0);

    const totalPriceWithDefaults = (service.price || 0) + defaultOptionsPrice;

    return {
      id: service.id,
      name: JSON.stringify(service.name),
      description: JSON.stringify(service.description),
      image: service.image,
      durationMinutes: service.durationMinutes,
      availableFrom: service.availableFrom,
      availableTo: service.availableTo,
      price: service.price,
      priceAfterDiscount: service.priceAfterDiscount,
      discount: service.discount,
      discountType: service.discountType,
      status: service.status,
      totalOrders: service.totalOrders,
      totalAmountSold: service.totalAmountSold,
      rating: service.rating,
      review: service.review,
      bestRated: service.bestRated,
      mostSeller: service.mostSeller,
      createdAt: service.createdAt,
      priceWithDefaultOptions: totalPriceWithDefaults,
      Module: moduleDTO,
      Category: categoryDTO,
      SubCategory: subCategoryDTO,
      Store: storeDTO,
      Variation: variationsDTO,
    };
  };

  mapServices = (services: any[]): ServiceDTO[] => {
    return Array.isArray(services)
      ? services.map((service) => this.mapServiceObject(service))
      : [];
  };
}
