import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateSubCategoryDTO,
  FilterSubCategoryDTO,
  UpdateSubCategoryDTO,
} from './dto/subcategory.dto';

import {
  getSubCategoryArgs,
  getSubCategoryArgsWithSelect,
} from './prisma-args/subcategory.prisma.args';
import { LanguagesService } from 'src/_modules/languages/languages.service';
@Injectable()
export class SubCategoryService {
  constructor(
    private readonly Language: LanguagesService,
    private readonly prisma: PrismaService,
  ) {}

  async create(data: CreateSubCategoryDTO) {
    await this.prisma.category.create({
      data,
    });
  }

  async update(id: Id, body: UpdateSubCategoryDTO) {
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
