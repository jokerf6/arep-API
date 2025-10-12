import { ApiProperty, PartialType } from '@nestjs/swagger';
import { PaymentMethod } from '@prisma/client';
import { ValidateEnum } from 'src/decorators/dto/enum.decorator';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateNumber, ValidateNumberArray } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateString } from 'src/decorators/dto/validators/validate-string.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class CreateOrderDTO {
  @Optional()
  @ValidateString()
  note?: string;
  @Optional()
  @ValidateString()
  couponCode?: string;
  @Required()
  @ValidateNumber()
  addressId: Id;
  @Required()
  @ValidateNumber()
  serviceId: Id;
  @Required()
  @ValidateNumberArray({allowNegative:false})
  variantOptionIds: Id[];
  @Required()
  @ValidateDate()
  date:Date
  @Required()
  @ValidateNumber()
  @ValidateExist({model:'user'})
  userId:Id;
  @Required()
  @ValidateNumber({allowNegative:false})
  quantity:number;
  @Required()
  @ValidateEnum(PaymentMethod)
  paymentMethod:PaymentMethod;

}
export class UpdateOrderDTO extends PartialType(CreateOrderDTO) {}

export class SortOrderDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id?: SortOptions;
}
export class FilterOrderDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumber()
  id?: Id;
@Optional()
@ValidateNumber()
userId:Id;
@Optional()
@ValidateNumber()
storeId:Id;
  @Optional()
  orderBy?: SortOrderDTO[];
}

