import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateName } from 'src/decorators/dto/validators/validate-json.decorator';
import { RequiredFile } from 'src/_modules/media/decorators/upload.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';

export class CreateCategoryDTO {
  @Required()
  @ValidateName()
  name: Json;

  @RequiredFile()
  image: string;

  @Optional()
  @ValidateNumber({})
  @ValidateExist<'module'>({ model: 'module' })
  moduleId?: Id;

  @Optional()
  @ValidateNumber({ allowNegative: false })
  @ValidateExist<'store'>({ model: 'store' })
  storeId?: Id;
}
export class UpdateCategoryDTO extends PartialType(CreateCategoryDTO) {
  @Optional()
  @ValidateBoolean()
  active?:boolean;
 }

export class SortCategoryDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;
}
export class FilterCategoryDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateNumber()
  moduleId?: Id;
  @Optional()
  @ValidateNumber()
  storeId?: Id;
  @Optional()
  orderBy?: SortCategoryDTO[];
}
