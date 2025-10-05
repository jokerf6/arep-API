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
import { PrivateSettingService } from 'src/globals/services/settings.service';
import { HelpersService } from './helpers.service';

@Injectable()
export class StoreService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly nearestService: StoreNearestService,
    private readonly Language: LanguagesService,
    private readonly settingService: PrivateSettingService,
    private readonly helpersService:HelpersService
  ) {}

  async create(data: CreateStoreDTO) {
    const {User,...storeData}=data
  const existingUser=  await this.helpersService.isUserExist(User)
   const user= await this.prisma.$transaction(async(tx)=>{
   const store= await tx.store.create({
      data:{
        ...storeData
      },
    });
   const user= await this.helpersService.createUser(User,existingUser,tx,store.id);
   return user;
    })
return user;
  }

  async update(id: Id, body: UpdateStoreDTO) {
    const {User,...storeData}=body
    await this.prisma.store.update({ where: { id }, data: storeData });
  }

  async findAll(filters: FilterStoreDTO) {
    const customerId = filters?.customerId;
    const languages = await this.Language.getCashedLanguages();
    const maxKm = await this.settingService.getSettings(['storeNearestByKM']);
    const stores = await this.nearestService.getNearestStores(filters?.km || maxKm.shippingKMCharge, filters?.limit || 10, filters);
    const args = getStoreArgs(filters, languages, stores);
    const argsWithSelect = getStoreArgsWithSelect(customerId);

    const data = await this.prisma.store[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return {data, nearest: stores};
  }

  async count(filters: FilterStoreDTO) {
    const customerId = filters?.customerId;
    let stores = [];
    if (customerId) {
          const maxKm = await this.settingService.getSettings(['storeNearestByKM']);
      stores = await this.nearestService.getNearestStores(filters?.km || maxKm.shippingKMCharge, filters?.limit || 10, filters);
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
