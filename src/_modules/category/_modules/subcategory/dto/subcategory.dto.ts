import { ApiProperty, PartialType } from '@nestjs/swagger';
import { OptionalFile } from 'src/_modules/media/decorators/upload.decorator';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateName } from 'src/decorators/dto/validators/validate-json.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class CreateSubCategoryDTO {
  @Required()
  @ValidateName()
  name: Json;

  @OptionalFile()
  image: string;
  @Required()
  @ValidateNumber({allowNegative:false})
  @ValidateExist<'category'>({ model: 'category', extraConditions: { parentId: null } })
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

  @Optional()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  moduleId?: Id;
}
