import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateBankAccountDTO,
  FilterBankAccountDTO,
  UpdateBankAccountDTO,
} from './dto/bankAccount.dto';

import {
  getBankAccountArgs,
  getBankAccountArgsWithSelect,
} from './prisma-args/bankAccount.prisma.args';
import { LanguagesService } from '../languages/languages.service';
@Injectable()
export class BankAccountService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly languages: LanguagesService, // Assuming languages is injected or available
  ) {}

  async create(data: CreateBankAccountDTO) {
    await this.prisma.bankAccount.create({
      data,
    });
  }

  async update(id: Id, body: UpdateBankAccountDTO) {
    await this.prisma.bankAccount.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterBankAccountDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getBankAccountArgs(filters, languages);
    const argsWithSelect = getBankAccountArgsWithSelect();

    const data = await this.prisma.bankAccount[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterBankAccountDTO) {
    const languages = await this.languages.getCashedLanguages();
    const args = getBankAccountArgs(filters, languages);
    const total = await this.prisma.bankAccount.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.bankAccount.delete({
      where: {
        id,
      },
    });
  }
}
