import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { PaginationParamsDTO } from 'src/dtos/params/pagination-params.dto';

export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

export enum RequestLogSortField {
  CREATED_AT = 'createdAt',
  DURATION = 'duration',
  STATUS_CODE = 'statusCode',
}

export class FilterRequestLogDTO extends PaginationParamsDTO {
  
  @Optional()
  method?: string;

   @Optional()

  url?: string;

  @Optional()

  statusCode?: number;

  @Optional()
  userId?: string;

  @Optional()
  ip?: string;

  @Optional()
  orderBy?: RequestLogSortField;

  @Optional()
  sortOrder?: SortOrder;
}
