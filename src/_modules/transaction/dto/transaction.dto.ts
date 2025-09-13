import { ApiProperty } from '@nestjs/swagger';
import { TransactionType } from '@prisma/client';
import { Transform } from 'class-transformer';
import {IsNumber } from 'class-validator';
import { ValidateEnum } from 'src/decorators/dto/enum.decorator';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { SortProp } from 'src/decorators/dto/sort-prop.decorator';
import { OptionalSwagger } from 'src/decorators/dto/validators/optional-swagger.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateNumber, ValidateNumberArray } from 'src/decorators/dto/validators/validate-number.decorator';
import { EnumArrayFilter } from 'src/decorators/filters/enum.filter.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export class CreateTransactionDTO {

  balance?:number;

  @Required()
  customerId:Id;

  @Required()
  @ValidateNumber()
  credit:number;


  @Required()
  @ValidateNumber()
  debit:number;


  @Required()
  @ValidateEnum(TransactionType)
  type: TransactionType;
}
export class SortTransactionDTO {
  @SortProp()
  @ApiProperty({ example: 'asc' })
  id: SortOptions;
}
export class FilterTransactionDTO extends PaginationParamsDTO {
  @Optional()
  @ValidateNumberArray()
  id?: Id | Id[];

  @Optional()
  @ValidateNumberArray()
  customerId?: Id | Id[];


  @Optional()
  @ValidateNumber()
  @ValidateExist<"module">({model:"module"})
  moduleId:Id;


  @Optional()
  @ValidateNumber()
  @ValidateExist<"store">({model:"store"})
  storeId:Id;

  @Optional()
  @EnumArrayFilter(TransactionType, 'Type', 'Transaction Type')
  type?: TransactionType[];

  @Optional({ example: new Date() })
  @ValidateDate()
  transactionDateFrom?: Date;

  @Optional({ example: new Date() })
  @ValidateDate()
  transactionDateTo?: Date;

  @Optional()
  orderBy?: SortTransactionDTO[];
}
