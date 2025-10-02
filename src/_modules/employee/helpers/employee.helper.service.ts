import { BadRequestException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from 'src/globals/services/prisma.service';

@Injectable()
export class HelpersService {
  constructor(private readonly prisma: PrismaService) {}
async isRoleValid(roleKey: string, storeId?: number) {
  const role = await this.prisma.role.findUnique({
    where: {
      roleKey,
      storeId,
    },
  });
  if (!role) {
    throw new BadRequestException('Invalid role');
  }
  return role
}
async canUserAccessEmployee(user: CurrentUser, employeeId: number) {
  const employee= await this.prisma.user.findUnique({
    where: {
      id: employeeId,
    },
  });
  if (!employee) {
    throw new BadRequestException('Invalid employee');
  }
  if (!user?.storeId||employee?.storeId !== user?.storeId) {
    throw new BadRequestException('You do not have access to this employee');
  }
  return employee;
}
}
