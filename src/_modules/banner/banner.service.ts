import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateBannerDTO,
  FilterBannerDTO,
  UpdateBannerDTO,
} from './dto/banner.dto';

import {
  getBannerArgs,
  getBannerArgsWithSelect,
} from './prisma-args/banner.prisma.args';
import { LanguagesService } from '../languages/languages.service';
import { BannerHelperService } from './helpers/banner.helper.service';
@Injectable()
export class BannerService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language: LanguagesService,
    private readonly bannerHelper: BannerHelperService,
  ) {}

  async create(data: CreateBannerDTO) {
    await this.prisma.banner.create({
      data,
    });
  }

  async update(id: Id, body: UpdateBannerDTO) {
    await this.prisma.banner.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterBannerDTO, isCustomer = false) {
    console.log(isCustomer);
    const languages = await this.Language.getCashedLanguages();
    const args = getBannerArgs(filters, languages, isCustomer);
    const argsWithSelect = getBannerArgsWithSelect();

    const data = await this.prisma.banner[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterBannerDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getBannerArgs(filters, languages);
    const total = await this.prisma.banner.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.banner.delete({
      where: {
        id,
      },
    });
  }
}
