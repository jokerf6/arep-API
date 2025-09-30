import { Injectable } from '@nestjs/common';
import { grouped } from 'src/_modules/user/helpers/auth.groupBy.helper';
import { PrismaService } from 'src/globals/services/prisma.service';
import { UpdatePermissionDTO } from '../dto/permission.dto';

@Injectable()
export class PermissionService {
  constructor(private readonly prisma: PrismaService) {}

  async get() {
    return grouped(
  await    this.prisma.permission.findMany({ where: { default: false } }),
    );
  }

  async update(id: Id, data: UpdatePermissionDTO) {
    await this.prisma.permission.update({ where: { id }, data });
  }
}
