  export  function validatePermissions(
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