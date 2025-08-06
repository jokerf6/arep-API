import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateModuleDTO,
  FilterModuleDTO,
  UpdateModuleDTO,
} from './dto/module.dto';

import {
  getModuleArgs,
  getModuleArgsWithSelect,
} from './prisma-args/module.prisma.args';
import { LanguagesService } from '../languages/languages.service';
@Injectable()
export class ModuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Languages: LanguagesService,
  ) {}

  async create(data: CreateModuleDTO) {
    await this.prisma.module.create({
      data,
    });
  }

  async update(id: Id, body: UpdateModuleDTO) {
    await this.prisma.module.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterModuleDTO) {
    const languages = await this.Languages.getCashedLanguages();
    const args = getModuleArgs(filters, languages);
    const argsWithSelect = getModuleArgsWithSelect();

    const data = await this.prisma.module[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterModuleDTO) {
    const languages = await this.Languages.getCashedLanguages();
    const args = getModuleArgs(filters, languages);
    const total = await this.prisma.module.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.module.delete({
      where: {
        id,
      },
    });
  }
}
