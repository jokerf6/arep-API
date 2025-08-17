import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { LanguagesService } from '../../languages/languages.service';
import { FilterServiceDTO } from '../dto/service.dto';
import { getServiceArgs, getServiceArgsWithSelect } from '../prisma-args/service.prisma.args';
import { ServiceModuleHelper } from './serviceModule.helper.service';
@Injectable()
export class ServiceModuleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language: LanguagesService,
    private readonly helper: ServiceModuleHelper
  ) {}

  async findAll(filters: FilterServiceDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getServiceArgs(filters, languages);
    const argsWithSelect = getServiceArgsWithSelect();

    const services = await this.prisma.service[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    const data = this.helper.mapServices(Array.isArray(services) ? services : [services]);

    return data;
  }

  async count(filters: FilterServiceDTO) {
    const languages = await this.Language.getCashedLanguages();
    const args = getServiceArgs(filters, languages);
    const total = await this.prisma.service.count({ where: args.where });

    return total;
  }

  
}
