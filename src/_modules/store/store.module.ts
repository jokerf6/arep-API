import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { StoreFavouriteController } from './controllers/store.favourite.controller';
import { StoreFavouriteService } from './services/store.favourite.service';
import { StoreNearestService } from './services/store.nearest.service';
import { LanguagesService } from '../languages/languages.service';
import { HelpersService } from './services/helpers.service';
import { OTPService } from '../authentication/services/otp.service';
import { TokenService } from '../authentication/services/jwt.service';
import { StoreScheduleController } from './controllers/store.schedule.controller';
import { ScheduleHelpersService } from './services/store.schedule.helper.service';
import { ScheduleService } from './services/store.schedule.service';
import { GlobalHelpers } from 'src/globals/services/globalHelpers.service';

@Module({
  imports: [],
  controllers: [StoreFavouriteController, StoreController,StoreScheduleController],
  providers: [StoreService, StoreFavouriteService,StoreNearestService,LanguagesService,HelpersService,OTPService,TokenService,ScheduleHelpersService,ScheduleService,GlobalHelpers],
})
export class StoreModule {}
