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
import { ValidateObject } from 'src/decorators/dto/validators/validate-nested.decorator';
import { PriceRangeDTO } from 'src/_modules/filter/dto/filter.dto';
import { ValidatePassword } from 'src/decorators/dto/validators/validate-password.decorator';
import { ValidatePhone } from 'src/decorators/dto/validators/validate-phone.decorator';
import { ValidateEmail } from 'src/decorators/dto/validators/validate-email.decorator';
export class CreateStoreUserDTO {
  @Required()
  @ValidateString()
  name: string;

  @Required()
  @ValidateEmail()
  email: string;

  @Required()
  @ValidatePhone()
  phone: string;

  @Required()
  @ValidatePassword()
  password: string;


}
export class CreateStoreDTO {
  @Required()
  @ValidateName()
  name: Json;
 @Required()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  moduleId: Id;

  @Required()
  @ValidateNumber()
  @ValidateExist<'city'>({ model: 'city' })
  cityId: Id;
  @RequiredFile()
  logo: string;

  @RequiredFile()
  cover: string;
  @Required()
  @Min(-90)
  @Max(90)
  @ValidateNumber({ allowNegative: true })
  lat: number;

  @Required()
  @ValidateNumber({ allowNegative: true })
  @Min(-180)
  @Max(180)
  lng: number;
  @Required()
  @ValidateString()
  address: string;
  @Required()
  phone: string;
  @Required()
  @ValidateObject(CreateStoreUserDTO)
  User:CreateStoreUserDTO
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
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateString()
  address?: string;

  @Optional()
  @ValidateNumber()
  rating?: number;

  @Optional()
  @ValidateNumber()
  moduleId?: Id;
    @Optional()
  @ValidateNumber()
  categoryId?: Id;
    @Optional()
  @ValidateNumber()
   subCategoryId?: Id;
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

  @Optional()
  @ValidateNumber()
   km:number;

  @Optional({type:PriceRangeDTO})
  @ValidateObject(PriceRangeDTO)
  price?: PriceRangeDTO;

  @OptionalSwagger()
  @ValidateNumber()
  customerId: Id;

  @Optional()
  orderBy?: SortStoreDTO[];
}
