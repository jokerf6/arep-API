import { Optional } from "src/decorators/dto/optional-input.decorator";
import { ValidateNumber } from "src/decorators/dto/validators/validate-number.decorator";

export class FilterSlotsDTO  {
 
  @Optional()
  @ValidateNumber()
  slots?: number;

}
