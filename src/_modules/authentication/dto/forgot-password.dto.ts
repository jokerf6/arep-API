import { Required } from 'src/decorators/dto/required-input.decorator';
import { OptionalSwagger } from 'src/decorators/dto/validators/optional-swagger.decorator';
import { ValidateExist } from 'src/decorators/dto/validators/validate-found-number.decorator';
import { ValidatePhone } from 'src/decorators/dto/validators/validate-phone.decorator';

export class ForgetPasswordDTO {
  @Required({})
  @ValidatePhone()
  phone: string;

  @OptionalSwagger()
  @ValidateExist<'role'>({ model: 'role' })
  roleKey?: string;
}
