import { Optional } from "src/decorators/dto/optional-input.decorator";
import { Required } from "src/decorators/dto/required-input.decorator";
import { ValidateBoolean } from "src/decorators/dto/validators/validate-boolean.decorator";
import { ValidateObject } from "src/decorators/dto/validators/validate-nested.decorator";
import { ValidateNumber } from "src/decorators/dto/validators/validate-number.decorator";
import { ValidateString } from "src/decorators/dto/validators/validate-string.decorator";

export class VariantOption{
    @Required()
    @ValidateString()
    name: string;
    @Required()
    @ValidateNumber()
    price: number;
    @Optional()
    @ValidateBoolean()
    default: boolean;

}
export class VariantDTO {
        @Required()
    @ValidateString()
    name: string;
      @Optional()
    @ValidateBoolean()
    required: boolean;
        @Optional()
    @ValidateNumber()
    minQuantity: number;
        @Optional()
    @ValidateNumber()
    maxQuantity: number;
          @Optional()
    @ValidateBoolean()
    single: boolean;
    @Required({type:VariantOption,isArray:true})
    @ValidateObject(VariantOption,true)
    Options: VariantOption[];
    
}