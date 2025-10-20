import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateCategoryDTO,
  FilterCategoryDTO,
  UpdateCategoryDTO,
} from './dto/category.dto';

import {
  getCategoryArgs,
  getCategoryArgsWithSelect,
} from './prisma-args/category.prisma.args';
import { LanguagesService } from '../languages/languages.service';
@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, // Assuming languages is injected or available
  ) { }

  async create(data: CreateCategoryDTO) {
    if (data.storeId) {
      const isFound = await this.prisma.store.findUnique({
        where: { id: data.storeId },
      });
      data.moduleId = isFound?.moduleId;
    }
    await this.prisma.category.create({
      data: {
        name: data.name,
        image: data.image,
        moduleId: data.moduleId,
        storeId: data.storeId,
      },
    });
  }

  async update(id: Id, body: UpdateCategoryDTO) {
    await this.prisma.category.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterCategoryDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getCategoryArgs(filters, languages);
    const argsWithSelect = getCategoryArgsWithSelect();

    const data = await this.prisma.category[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterCategoryDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getCategoryArgs(filters, languages);
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
