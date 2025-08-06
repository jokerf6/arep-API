import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

@Injectable()
export class OptionalAuthGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean {
    const user = context.switchToHttp().getRequest().user;
    if (!user) {
      return true;
    }
    const request = context.switchToHttp().getRequest();
    const method = request.method;
    const requiredPermissions = this.reflector.getAllAndOverride(
      env('PERMISSION_METADATA_KEY') as string,
      [context.getClass(), context.getHandler()],
    );
    const userPermissions =
      context.switchToHttp().getRequest().user?.permissions || [];
    if (requiredPermissions && requiredPermissions.length >= 0) {
      return this.validatePermissions(
        `${requiredPermissions[0]}_${method.toLowerCase()}`,
        userPermissions,
      );
    } else {
      return true; // If no permissions are required, allow access
    }
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
