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
import { Max, Min } from 'class-validator';
import { ValidateEnum } from 'src/decorators/dto/enum.decorator';
import { StoreStatus } from '@prisma/client';
import { OptionalSwagger } from 'src/decorators/dto/validators/optional-swagger.decorator';

export class CreateStoreDTO {
  @Required()
  @ValidateName()
  name: Json;

  @RequiredFile()
  logo: string;

  @RequiredFile()
  cover: string;

  @Required()
  @ValidateString()
  address: string;

  @Required()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  moduleId: Id;

  @Required()
  @Min(-90)
  @Max(90)
  @ValidateNumber({ allowNegative: true })
  lat: number;

  @Required()
  @ValidateNumber({ allowNegative: true })
  @Min(-90)
  @Max(90)
  lng: number;

  @Required()
  @ValidateNumber()
  @ValidateExist<'plan'>({ model: 'plan' })
  planId: Id;

  @Required()
  @ValidateNumber()
  @ValidateExist<'city'>({ model: 'city' })
  cityId: Id;

  @Required()
  @ValidateBoolean()
  verified: boolean;

  @Required()
  phone: string;
}
export class UpdateStoreDTO extends PartialType(CreateStoreDTO) {
  @Optional()
  @ValidateBoolean()
  temporarilyClosed: boolean;

  @Optional()
  @ValidateEnum(StoreStatus)
  status: StoreStatus;
}

export class SortStoreDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;
}
export class FilterStoreDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  @ValidateExist<'store'>({ model: 'store' })
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateString()
  address?: string;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  moduleId?: Id;

  @Optional()
  @ValidateNumber({ allowNegative: true })
  lat?: number;

  @Optional()
  @ValidateNumber({ allowNegative: true })
  lng?: number;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'plan'>({ model: 'plan' })
  planId?: Id;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'city'>({ model: 'city' })
  cityId?: Id;

  @Optional()
  @ValidateBoolean()
  verified?: boolean;

  @Optional()
  @ValidateBoolean()
  closed?: boolean;

  @Optional()
  @ValidateBoolean()
  temporarilyClosed?: boolean;

  @Optional()
  @ValidateEnum(StoreStatus)
  status?: string;

  @OptionalSwagger()
  favouriteCustomerId: Id;

  @OptionalSwagger()
  @ValidateNumber()
  customerId: Id;

  @Optional()
  orderBy?: SortStoreDTO[];
}
