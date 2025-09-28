import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateName } from 'src/decorators/dto/validators/validate-json.decorator';
import { RequiredFile } from 'src/_modules/media/decorators/upload.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateEnum } from 'src/decorators/dto/enum.decorator';
import {
  DiscountServiceType,
  StoreStatus,
} from '@prisma/client';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { OptionalSwagger } from 'src/decorators/dto/validators/optional-swagger.decorator';

export class CreateServiceDTO {
  @Required()
  @ValidateName()
  name: Json;

  @Required()
  @ValidateName()
  description: Json;

  @RequiredFile()
  image: string;

  @Required()
  @ValidateNumber()
  durationMinutes: number;

  @Required()
  @ValidateDate()
  availableFrom: Date;

  @Required()
  @ValidateDate()
  availableTo: Date;

  @Required()
  @ValidateNumber()
  price: number;

  @Required()
  @ValidateNumber()
  discount: number;

  @Required()
  @ValidateEnum(DiscountServiceType)
  discountType: DiscountServiceType;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'store'>({ model: 'store' })
  storeId: Id;

  @Required()
  @ValidateNumber()
  @ValidateExist<'category'>({
    model: 'category',
    extraConditions: { parentId: { not: null } },
  })
  subCategoryId: Id;
}
export class UpdateServiceDTO extends PartialType(CreateServiceDTO) {
  @Optional()
  @ValidateEnum(StoreStatus)
  status: StoreStatus;
}

export class SortServiceDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;
}
export class FilterServiceDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  @ValidateExist<'service'>({ model: 'service' })
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateString()
  description?: string;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  moduleId?: Id;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'store'>({ model: 'store' })
  storeId?: Id;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'category'>({
    model: 'category',
    extraConditions: { parentId: null },
  })
  categoryId?: Id;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'category'>({
    model: 'category',
    extraConditions: { parentId: { not: null } },
  })
  subCategoryId?: Id;

  @Optional()
  @ValidateBoolean()
  bestRated?: boolean;

  @Optional()
  @ValidateBoolean()
  mostSeller?: boolean;

  @Optional()
  @ValidateEnum(StoreStatus)
  status?: string;

  @Optional()
  @ValidateNumber()
  customerId?: Id;

  @OptionalSwagger()
  favouriteCustomerId: Id;
}
