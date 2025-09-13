import { Module } from '@nestjs/common';
import { CustomerCreateController } from './controllers/customer.create.controller';
import { CustomerController } from './controllers/customer.controller';
import { CustomerService } from './services/customer.service';
import { CustomerCreateService } from './services/customer.create.service';
import { OTPService } from 'src/_modules/authentication/services/otp.service';
import { TokenService } from 'src/_modules/authentication/services/jwt.service';
import { AddressModule } from './_modules/address/address.module';
import { FundModule } from './_modules/fund/fund.module';

@Module({
  imports: [
    AddressModule,
    FundModule
  ],
  controllers: [CustomerCreateController, CustomerController],
  providers: [CustomerService, CustomerCreateService, OTPService, TokenService],
  exports: [],
})
export class CustomerModule {}
