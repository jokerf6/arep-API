export class ModuleDTO {
  id: number;
  name: string;
}

export class CategoryDTO {
  id: number;
  name: string | Json;
  Module: ModuleDTO;
}

export class SubCategoryDTO {
  id: number;
  name: string | Json;
}

export class VariationOptionDTO {
  name: string;
  price: number;
  default: boolean;
}

export class VariationDTO {
  id: number;
  name: string;
  required: boolean;
  maxQuantity: number;
  minQuantity: number;
  single: boolean;
  VariationOption: VariationOptionDTO[];
}
export class StoreDTO {
  id: number;
  name: string | Json;;
  cover: string;
  logo: string;
  rating: number;
  review: number;
  address?:string
}

export class ServiceDTO {
  id: number;
  name: string | Json;
  description: string | Json;
  image: string;
  durationMinutes: number;
  availableFrom: string;
  availableTo: string;
  price: number;
  priceAfterDiscount: number;
  discount: number;
  discountType: string;
  status: string;
  totalOrders: number;
  totalAmountSold: number;
  rating: number;
  review: string;
  bestRated: boolean;
  mostSeller: boolean;
  createdAt: Date;
  Module: ModuleDTO;
  Category: CategoryDTO;
  SubCategory: SubCategoryDTO;
  Store: StoreDTO;
  Variation: VariationDTO[];
  priceWithDefaultOptions: number;

}