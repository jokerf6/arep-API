import { PartialType } from '@nestjs/swagger';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class CreateStoreRatingDTO {
  @Required()
  @ValidateNumber()
  rating: number;
  @Required()
  @ValidateNumber({ allowNegative: false })
  storeId: Id;
  @Optional()
  @ValidateNumber({ allowNegative: false })
  userId: Id;
}
export class UpdateStoreRatingDTO 
{
    @Required()
  @ValidateNumber()
  rating: number;

  @Optional()
  @ValidateNumber({ allowNegative: false })
  userId: Id;
}

export class FilterStoreRatingDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;

  @Optional()
  @ValidateNumber()
  storeId?: string;
  @Optional()
  @ValidateNumber()
  userId?: string;
}
