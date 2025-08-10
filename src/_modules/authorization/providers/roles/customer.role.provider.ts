import { mapPermissionConfigToRole } from '../../../../../src/globals/helpers/mapRoles.helper';
import { PermissionMap } from '../permissions.provider';

const customerPermissions: PermissionMap = {
  languages: ['get'],
  profile: ['post', 'get', 'patch'],
  modules: ['get'],
  addresses: ['post', 'get', 'patch', 'delete'],
  banners: ['get'],
} as const satisfies PermissionMap;

export const CustomerRole = {
  id: 2,
  name: { en: 'customer', ar: 'عميل' },
  key: 'Customer',
  default: true,
  permissions: mapPermissionConfigToRole(customerPermissions),
};
