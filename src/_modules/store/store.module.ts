import { Module } from '@nestjs/common';
import { StoreController } from './controllers/store.controller';
import { StoreService } from './services/store.service';
import { StoreFavouriteController } from './controllers/store.favourite.controller';
import { StoreFavouriteService } from './services/store.favourite.service';
import { StoreNearestService } from './services/store.nearest.service';
import { LanguagesService } from '../languages/languages.service';

@Module({
  imports: [],
  controllers: [StoreFavouriteController, StoreController],
  providers: [StoreService, StoreFavouriteService,StoreNearestService,LanguagesService],
})
export class StoreModule {}
