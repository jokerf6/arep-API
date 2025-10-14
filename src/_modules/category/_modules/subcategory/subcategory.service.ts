import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateSubCategoryDTO,
  FilterSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './dto/subcategory.dto';

import { LanguagesService } from 'src/_modules/languages/languages.service';
import {
  getSubCategoryArgs,
  getSubCategoryArgsWithSelect,
} from './prisma-args/subcategory.prisma.args';
@Injectable()
export class SubCategoryService {
  constructor(
    private readonly Language: LanguagesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateSubCategoryDTO) {
    const parentCategory = await this.prisma.category.findUnique({
      where: {
        id: data.parentId,
        parentId: null
      },
    });
    if(!parentCategory){
      throw new NotFoundException('Invalid parent category');
    }
    if(data.storeId&& parentCategory.storeId!==data.storeId){
      throw new NotFoundException('Store Can`t use this Parent Category');
    }
    await this.prisma.category.create({
      data:{
        ...data,
        moduleId:parentCategory.moduleId,
      },
    });
  }

  async update(id: Id, body: UpdateSubCategoryDTO) {
if(body.parentId){
     const existingSubCategory = await this.prisma.category.findUnique({
      where: {
        id,
      },
    });
    if(!existingSubCategory){
      throw new NotFoundException('SubCategory not found');
    }
    if(existingSubCategory.storeId){
      const parent=await this.prisma.category.findUnique({
        where:{
          id:body.parentId,
          storeId:existingSubCategory.storeId,
        parentId:null
        }
      });
      if(!parent){
        throw new NotFoundException('Parent category not found');
      }
    }
}
    await this.prisma.category.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterSubCategoryDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getSubCategoryArgs(filters, languages);
    const argsWithSelect = getSubCategoryArgsWithSelect();

    const data = await this.prisma.category[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterSubCategoryDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getSubCategoryArgs(filters, languages);
    const total = await this.prisma.category.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.category.delete({
      where: {
        id,
      },
    });
  }
}
