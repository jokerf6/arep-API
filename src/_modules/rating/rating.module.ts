import { Module } from '@nestjs/common';
import { ServiceRatingModule } from './serviceRating/serviceRating.module';
import { StoreRatingModule } from './storeRating/storeRating.module';

@Module({
imports:[ServiceRatingModule,StoreRatingModule]
})
export class RatingModule {}
