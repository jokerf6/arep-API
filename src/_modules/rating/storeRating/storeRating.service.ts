import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateStoreRatingDTO,
  FilterStoreRatingDTO,
  UpdateStoreRatingDTO,
} from './dto/storeRating.dto';

import {
  getStoreRatingArgs,
  getStoreRatingArgsWithSelect,
} from './prisma-args/storeRating.prisma.args';
import { LanguagesService } from 'src/_modules/languages/languages.service';
import { HelpersService } from './services/helpers.service';
import { calculateDeletedAverageRating, calculateNewAverageRating, calculateUpdatedAverageRating } from 'src/globals/helpers/calculateAverageRating.helper';
@Injectable()
export class StoreRatingService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, // Assuming languages is injected or available
    private readonly helpers: HelpersService
  ) {}
async create(body:CreateStoreRatingDTO,){
  const service=await this.helpers.getServiceById(body.storeId);
await this.helpers.canUserRate(body.userId,body.storeId);
const rating=calculateNewAverageRating(service.rating,service.review,body.rating);
body.rating=rating;
await this.prisma.$transaction(async(tx)=>{
await tx.storeRating.create({
  data:{
    ...body,
  }
})

await tx.service.update({
  where:{
    id:body.storeId
  },
  data:{
    rating,
    review:{
      increment:1
    },
  }
})
})

}
async update(id: Id, body: UpdateStoreRatingDTO) {
  const oldRating = await this.helpers.getRatingById(id, body.userId);


  const { rating: oldAverage, review: totalReviews } =oldRating.Store ;
  const { rating: oldUserRating } = oldRating;
  const { rating: newUserRating } = body;

const newAverage = calculateUpdatedAverageRating(
  oldAverage,
  totalReviews,
  oldUserRating,
  newUserRating,
);
await this.prisma.$transaction(async (tx) => {
 await tx.storeRating.update({
      where: { id: oldRating.id },
      data: { rating: newUserRating },
    }),
    await tx.service.update({
      where: { id },
      data: { rating: newAverage },
    })
  });


}

  async findAll(filters: FilterStoreRatingDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getStoreRatingArgs(filters, languages);
    const argsWithSelect = getStoreRatingArgsWithSelect();

    const data = await this.prisma.storeRating[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterStoreRatingDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getStoreRatingArgs(filters, languages);
    const total = await this.prisma.storeRating.count({ where: args.where });

    return total;
  }
async delete(id: Id, userId: Id) {
  const oldRating = await this.helpers.getRatingById(id, userId);
  if (!oldRating) throw new BadRequestException('Rating not found for this user');

  const { rating: oldAverage, review: totalReviews } = oldRating.Store;
  const { rating: deletedRating } = oldRating;

  const newAverage = calculateDeletedAverageRating(
    oldAverage,
    totalReviews,
    deletedRating,
  );

  await this.prisma.$transaction(async (tx) => {
    await tx.storeRating.delete({ where: { id: oldRating.id } });

    await tx.service.update({
      where: { id },
      data: {
        rating: newAverage,
        review: { decrement: 1 },
      },
    });
  });

}


}
