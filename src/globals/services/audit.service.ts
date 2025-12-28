import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from './prisma.service';
import { getAuditArgs } from 'src/app/_modules/audit/prisma-args/audit.prisma.args';

@Injectable()
export class AuditService {
  constructor(private prisma: PrismaService) {}

  async createAuditLog(data: {
    entityName: string;
    entityId: string;
    action: string;
    userId?: string;
    originalValues?: any;
    newValues?: any;
  }) {
    await this.prisma.auditLog.create({
      data: {
        entityName: data.entityName,
        entityId: data.entityId,
        action: data.action,
        userId: data.userId,
        originalValues: data.originalValues ?? undefined,
        newValues: data.newValues ?? undefined,
      },
    });
  }
  async getHistory(entityName: string, entityId: string) {
    const args = getAuditArgs({ entityName, entityId });
    const data= await this.prisma.auditLog.findMany(args);
    const total= await this.prisma.auditLog.count(args);
    return {data, total};
  }

  async getLog(id: number) {
    return await this.prisma.auditLog.findUnique({
      where: { id },
    });
  }

  getTrackedEntities() {
    const excludedModels = ['AuditLog', 'OTP', 'Session'];
    const allModels = Prisma.ModelName ? Object.values(Prisma.ModelName) : [];
    return allModels.filter(model => !excludedModels.includes(model));
  }
}
