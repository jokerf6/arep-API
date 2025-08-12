import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateStoreDTO,
  FilterStoreDTO,
  UpdateStoreDTO,
} from '../dto/store.dto';

import {
  getStoreArgs,
  getStoreArgsWithSelect,
} from '../prisma-args/store.prisma.args';
import { LanguagesService } from '../../languages/languages.service';
import { StoreNearestService } from './store.nearest.service';
@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nearestService: StoreNearestService,
    private readonly Language: LanguagesService,
  ) {}

  async create(data: CreateStoreDTO) {
    await this.prisma.store.create({
      data,
    });
  }

  async update(id: Id, body: UpdateStoreDTO) {
    await this.prisma.store.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterStoreDTO) {
    const customerId = filters?.customerId;
    const languages = await this.Language.getCashedLanguages();
    const stores = await this.nearestService.getNearestStores(50, 10, filters);
    const args = getStoreArgs(filters, languages, stores);
    const argsWithSelect = getStoreArgsWithSelect(customerId);

    const data = await this.prisma.store[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterStoreDTO) {
    const customerId = filters?.customerId;
    let stores = [];
    if (customerId) {
      stores = await this.nearestService.getNearestStores(50, 10, filters);
    }
    const languages = await this.Language.getCashedLanguages();
    const args = getStoreArgs(filters, languages, stores);
    const total = await this.prisma.store.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.store.delete({
      where: {
        id,
      },
    });
  }
}
