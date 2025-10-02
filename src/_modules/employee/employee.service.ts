import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { LanguagesService } from '../languages/languages.service';
import { CreateEmployeeDTO, FilterEmployeeDTO, UpdateEmployeeDTO } from './dto/employee.dto';
import { HelpersService } from './helpers/employee.helper.service';
import { getEmployeeArgs } from './prisma-args/employee.prisma.args';
@Injectable()
export class EmployeeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly Language: LanguagesService,
    private readonly helpers: HelpersService,
  ) {}
  async getAll(filters: FilterEmployeeDTO) {
    const args = getEmployeeArgs(filters);
    const employee = await this.prisma.user[firstOrMany(filters.id)](args);
    return employee;
  }
  async count(filters: FilterEmployeeDTO) {
    const args = getEmployeeArgs(filters);
    return this.prisma.user.count({ where: args.where });
  }
  async create(dto: CreateEmployeeDTO) {
    await this.helpers.isRoleValid(dto.roleKey, dto.storeId);
    await this.prisma.user.create({ data: { ...dto } });
  }
  async update(id: number, dto: UpdateEmployeeDTO,user:CurrentUser) {
    await this.helpers.canUserAccessEmployee(user, id);
    if (dto.roleKey) {
      await this.helpers.isRoleValid(dto.roleKey, user.storeId);
    }
    await this.prisma.user.update({ where: { id }, data: { ...dto } });
  }
  async delete(id: number,user:CurrentUser) {
    await this.helpers.canUserAccessEmployee(user, id);
    await this.prisma.user.delete({
      where: { id },
    });
  }
}
