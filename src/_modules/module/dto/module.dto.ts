import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { RequiredFile } from 'src/_modules/media/decorators/upload.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';

export class CreateModuleDTO {
  @Required()
  @ValidateString()
  name: string;

  @Required()
  @ValidateString()
  description: string;

  @RequiredFile()
  image: string;

  @Required()
  @ValidateNumber()
  order: number;
}
export class UpdateModuleDTO extends PartialType(CreateModuleDTO) {
  @Optional()
  @ValidateBoolean()
  active?: boolean;
}

export class SortModuleDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  order?: SortOptions;
}
export class FilterModuleDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  @ValidateExist<'module'>({ model: 'module' })
  id?: Id;

  @Optional()
  @ValidateString()
  name?: string;

  @Optional()
  @ValidateString()
  description?: string;

  @Optional()
  @ValidateBoolean()
  active?: boolean;

  @Optional()
  orderBy?: SortModuleDTO[];
}
