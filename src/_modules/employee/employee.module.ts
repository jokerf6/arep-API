import { Module } from '@nestjs/common';
import { EmployeeController } from './employee.controller';
import { EmployeeService } from './employee.service';
import { HelpersService } from './helpers/employee.helper.service';
import { LanguagesService } from '../languages/languages.service';

@Module({
  imports: [],
  controllers: [EmployeeController],
  providers: [EmployeeService, HelpersService, LanguagesService],
})
export class EmployeeModule {}
