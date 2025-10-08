import { ApiProperty } from '@nestjs/swagger';
import { Days } from '@prisma/client';
import { Validate } from 'class-validator';
import { Optional } from 'src/decorators/dto/optional-input.decorator';
import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidateNumber } from 'src/decorators/dto/validators/validate-number.decorator';
import { ValidateTime } from 'src/decorators/dto/validators/validate-time.decorator';
import { EnumArrayFilter } from 'src/decorators/filters/enum.filter.decorator';

export class CreateScheduleDTO {
  @Required({})
  @ValidateDate()
  openingTime: string;

  @Required({})
  @ValidateDate()
  closingTime: string;

  @ApiProperty()
  @EnumArrayFilter(Days, 'Day', 'Choose day')
  day: Days;
  @Optional()
  @ValidateNumber({allowNegative:false})
  @ValidateExist<'store'>({model:'store'})
  storeId:Id;
}
