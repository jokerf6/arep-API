import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { RequiredFile } from 'src/_modules/media/decorators/upload.decorator';
import { ValidateName } from 'src/decorators/dto/validators/validate-json.decorator';

export class CreateBannerDTO {
  @Required()
  @ValidateName()
  name: Json;

  @Required()
  @ValidateNumber({ allowNegative: false })
  @ValidateExist<'store'>({ model: 'store' })
  storeId: Id;

  @RequiredFile()
  image: string;
}
export class UpdateBannerDTO extends PartialType(CreateBannerDTO) {
  @Optional()
  @ValidateBoolean()
  active: boolean;
}

export class SortBannerDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;

  @SortProp()
  name?: SortOptions;

  @SortProp()
  storeId?: SortOptions;

  @SortProp()
  image?: SortOptions;

  @SortProp()
  active?: SortOptions;

  @SortProp()
  randomSeed?: SortOptions;
}
export class FilterBannerDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateNumber({ allowNegative: false })
  storeId?: Id;
  @Optional()
  @ValidateNumber({ allowNegative: false })
  moduleId?: Id;
  @Optional()
  @ValidateBoolean()
  active?: boolean;

  @Optional()
  orderBy?: SortBannerDTO[];
}
