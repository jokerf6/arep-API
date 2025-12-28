import { Required } from 'src/decorators/dto/required-input.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidatePhone } from 'src/decorators/dto/validators/validate-phone.decorator';

export class ForgetPasswordDTO {
  @Required({})
  @ValidatePhone()
  phone: string;

}
