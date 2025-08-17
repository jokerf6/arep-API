import { Module } from '@nestjs/common';
import { LanguagesService } from '../languages/languages.service';
import { ServiceModuleFavouriteController } from './controllers/serviceModule.favourite.controller';
import { ServiceModuleController } from './controllers/serviceModule.controller';
import { ServiceModuleService } from './services/storeModule.service';
import { ServiceModuleFavouriteService } from './services/serviceModule.favourite.service';
import { ServiceModuleHelper } from './services/serviceModule.helper.service';

@Module({
  imports: [],
  controllers: [ServiceModuleFavouriteController, ServiceModuleController],
  providers: [ServiceModuleService,ServiceModuleFavouriteService,LanguagesService,ServiceModuleHelper],
})
export class ServiceModule {}
