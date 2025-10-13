import { Optional } from "@nestjs/common";
import { ValidateNumber } from "src/decorators/dto/validators/validate-number.decorator";
import { ValidateString } from "src/decorators/dto/validators/validate-string.decorator";
import { ValidateDate } from 'src/decorators/dto/validators/validate-date.decorator';

export class OrderStatusCountFilterDTO {
    @Optional()
    @ValidateNumber({allowNegative:false})
    storeId?:Id;
    @Optional()
    @ValidateString()
    serviceOrClientName?:string;
    @Optional()
    @ValidateDate()
    fromDate?:string;
    @Optional()
    @ValidateDate()
    toDate?:string;

}