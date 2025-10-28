import { ApiProperty } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateBoolean } from 'src/decorators/dto/validators/validate-boolean.decorator';
import { PartialType } from '@nestjs/swagger';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { ValidateUnique } from 'src/decorators/dto/validators/validate-unique-number.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { RequiredFile } from 'src/_modules/media/decorators/upload.decorator';

export class CreateSocialMediaDTO {
  @Required()
  @ValidateString()
  @ValidateUnique<"socialMedia">({model:"socialMedia"})
  platform: string;

  @Required()
  link: string;

  @RequiredFile()
  image: string;

  @Required()
  @ValidateBoolean()
  isActive: boolean;
}
export class UpdateSocialMediaDTO extends PartialType(CreateSocialMediaDTO) {}

export class FilterSocialMediaDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateString()
  platform?: string;


  @Optional()
  @ValidateBoolean()
  isActive?: boolean;

}
