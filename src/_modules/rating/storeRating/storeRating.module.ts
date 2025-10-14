import { Module } from '@nestjs/common';
import { StoreRatingController } from './storeRating.controller';
import { StoreRatingService } from './storeRating.service';
import { HelpersService } from './services/helpers.service';

@Module({
  controllers: [StoreRatingController],
  providers: [StoreRatingService,HelpersService],
})
export class StoreRatingModule {}
