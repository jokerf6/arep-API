import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateBankDTO,
  FilterBankDTO,
  UpdateBankDTO,
} from './dto/bank.dto';

import {
  getBankArgs,
  getBankArgsWithSelect,
} from './prisma-args/bank.prisma.args';
import { LanguagesService } from '../languages/languages.service';
@Injectable()
export class BankService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, // Assuming languages is injected or available
  ) {}

  async create(data: CreateBankDTO) {
    await this.prisma.bank.create({
      data,
    });
  }

  async update(id: Id, body: UpdateBankDTO) {
    await this.prisma.bank.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterBankDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getBankArgs(filters, languages);
    const argsWithSelect = getBankArgsWithSelect();

    const data = await this.prisma.bank[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterBankDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getBankArgs(filters, languages);
    const total = await this.prisma.bank.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.bank.delete({
      where: {
        id,
      },
    });
  }
}
