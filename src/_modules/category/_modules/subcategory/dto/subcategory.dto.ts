import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateName } from 'src/decorators/dto/validators/validate-json.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';

export class CreateSubCategoryDTO {
  @Required()
  @ValidateName()
  name: Json;

  @Required()
  @ValidateExist<'category'>({ model: 'category' })
  parentId: Id;
}
export class UpdateSubCategoryDTO extends PartialType(CreateSubCategoryDTO) {}

export class SortCategoryDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;
}
export class FilterSubCategoryDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  @ValidateExist<'category'>({ model: 'category' })
  id?: Id;

  @Optional()
  @ValidateNumber()
  @ValidateExist<'category'>({ model: 'category' })
  parentId?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  orderBy?: SortCategoryDTO[];
}
