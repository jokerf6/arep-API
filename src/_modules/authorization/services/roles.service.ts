import { Injectable } from '@nestjs/common';
import { grouped } from 'src/_modules/user/helpers/auth.groupBy.helper';
import { firstOrMany } from 'src/globals/helpers/first-or-many';
import { PrismaService } from 'src/globals/services/prisma.service';
import { CreateRoleDTO, UpdateRoleDTO } from '../dto/role.dto';
import { selectAllRolesOBJ } from '../prisma-args/role.prisma-select';

@Injectable()
export class RoleService {
  constructor(private readonly prisma: PrismaService) {}

  async getRoles(user:CurrentUser,id?: Id) {
    const selectArgs = selectAllRolesOBJ();
    const roles = await this.prisma.role[firstOrMany(id)]({
      select: selectArgs,
      where:{
        storeId:user?.storeId||undefined
      }
    });
    let data = undefined;
    if (id) {
      const permissions = await this.prisma.permission.findMany({
        where: { RolePermission: { some: { roleId: id } } },
      });
      data = {
        ...roles,
        Permissions: grouped(permissions),
      };
    } else {
      data = roles;
    }
    return data;
  }

  async update(id: Id, data: UpdateRoleDTO) {
    const { permissionIds, ...rest } = data;
    await this.prisma.role.update({
      where: { id },
      data: rest,
    });
    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    await this.prisma.rolePermission.createMany({
      data: permissionIds.map((permissionId: Id) => ({
        roleId: id,
        permissionId,
      })),
    });
  }

  async delete(id: Id) {
    await this.prisma.role.delete({ where: { id } });
  }

  async post(data: CreateRoleDTO) {
    await this.prisma.role.create({
      data,
    });
  }
}
