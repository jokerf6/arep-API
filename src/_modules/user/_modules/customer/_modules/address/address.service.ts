import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/globals/services/prisma.service';

import { firstOrMany } from 'src/globals/helpers/first-or-many';
import {
  CreateAddressDTO,
  FilterAddressDTO,
  UpdateAddressDTO,
} from './dto/address.dto';

import {
  getAddressArgs,
  getAddressArgsWithSelect,
} from './prisma-args/address.prisma.args';
@Injectable()
export class AddressService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAddressDTO) {
    const count = await this.prisma.address.count({
      where: {
        userId: data.userId,
      },
    });
    await this.prisma.address.create({
      data: {
        ...data,
        default: count === 0 ? true : false,
      },
    });
  }

  async update(id: Id, body: UpdateAddressDTO) {
    if (body.default) {
      await this.prisma.address.updateMany({
        data: {
          default: false,
        },
        where: {
          default: true,
          userId: body.userId,
        },
      });
    }
    await this.prisma.address.update({ where: { id }, data: body });
  }

  async findAll(filters: FilterAddressDTO) {
    const args = getAddressArgs(filters);
    const argsWithSelect = getAddressArgsWithSelect();

    const data = await this.prisma.address[firstOrMany(filters?.id)]({
      ...argsWithSelect,
      ...args,
    });
    return data;
  }

  async count(filters: FilterAddressDTO) {
    const args = getAddressArgs(filters);
    const total = await this.prisma.address.count({ where: args.where });

    return total;
  }

  async delete(id: Id): Promise<void> {
    await this.prisma.address.delete({
      where: {
        id,
      },
    });
  }
}
