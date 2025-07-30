import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionAndTypeGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const requiredPermissions = this.reflector.getAllAndOverride(
      env('PERMISSION_METADATA_KEY') as string,
      [context.getClass(), context.getHandler()],
    );
    const userPermissions =
      context.switchToHttp().getRequest().user?.permissions || [];
    return this.validatePermissions(
      `${requiredPermissions[0]}_${method.toLowerCase()}`,
      userPermissions,
    );
  }

  validatePermissions(
    requiredPermissions: string,
    userPermissions: {
      name: { en: string; ar?: string };
      prefix: string;
      method: string;
    }[],
  ): boolean {
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }
    const hasPermission = userPermissions.some(
      (perm) => `${perm.prefix}_${perm.method}` === requiredPermissions,
    );
    if (hasPermission) {
      return true;
    }

    return false;
  }
}
