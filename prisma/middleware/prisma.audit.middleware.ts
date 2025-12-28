import { ClsService } from 'nestjs-cls';
import { Prisma, PrismaClient } from '@prisma/client';

export function AuditMiddleware(prisma: PrismaClient, cls: ClsService): Prisma.Middleware {
  return async (params, next) => {
        const { model, action, args } = params;
        if (model === 'AuditLog' || !model || model === 'OTP' || model === 'Session' ) return next(params);

        const userId = cls.get('user')?.id?.toString();

        // CREATE
        if (action === 'create') {
          const result = await next(params);
           try {
             // @ts-ignore
             await prisma.auditLog.create({
              data: {
                entityName: model,
                entityId: result.id?.toString(),
                action: 'CREATE',
                userId: userId,
                newValues: result,
              },
            });
           } catch (e) {
             console.error('Audit Log Error (Create)', e);
           }
           return result;
        }

        // UPDATE
        if (action === 'update') {
           const result = await next(params);
           try {
            // @ts-ignore
            await prisma.auditLog.create({
             data: {
               entityName: model,
               entityId: result.id?.toString(),
               action: 'UPDATE',
               userId: userId,
               newValues: result,
             },
           });
          } catch(e) { console.error('Audit Log Error (Update)', e) }
           return result;
        }
        
        // DELETE
        if (action === 'delete') {
             const result = await next(params);
             try {
                // @ts-ignore
                await prisma.auditLog.create({
                data: {
                    entityName: model,
                    entityId: result?.id?.toString() ?? '?',
                    action: 'DELETE',
                    userId: userId,
                    originalValues: result,
                },
                });
            } catch(e) { console.error('Audit Log Error (Delete)', e) }
            return result;
        }

        return next(params);
      };
}
