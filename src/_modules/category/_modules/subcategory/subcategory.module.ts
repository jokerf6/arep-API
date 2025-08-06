
import { Module } from '@nestjs/common';
import { SubCategoryController } from './subcategory.controller';
import { SubCategoryService } from './subcategory.service';

@Module({
  imports: [],
  controllers: [SubCategoryController],
  providers: [SubCategoryService],
})
export class SubCategoryModule {}

