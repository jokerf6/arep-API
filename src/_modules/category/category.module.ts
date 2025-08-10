import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';
import { SubCategoryModule } from './_modules/subcategory/subcategory.module';

@Module({
  imports: [SubCategoryModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
