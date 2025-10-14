import { Module } from '@nestjs/common';
import { ServiceRatingModule } from './serviceRating/serviceRating.module';

@Module({
imports:[ServiceRatingModule]
})
export class RatingModule {}
