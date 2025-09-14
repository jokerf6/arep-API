import { mapPermissionConfigToRole } from '../../../../../src/globals/helpers/mapRoles.helper';
import { PermissionMap } from '../permissions.provider';

const storePermissions: PermissionMap = {
  languages: ['get', ],
  users: ['get', ],
  roles: ['post', 'get', 'delete', 'patch'],
  profile: ['get', 'patch'],
  permissions: ['get', ],
  customers: ['get',],
  modules: [ 'get', ],
  banners: ['get', ],
  categories: [ 'get', ],
  subcategories: [ 'get',],
  stores: [ 'get', 'patch', ],
  services: ['post', 'get', 'patch', 'delete'],
  'social-media': [ 'get',],
  'system-notifications': ['get', 'patch'],
  fund: ['post', 'get'],
  coupons: ['get', ],




} as const satisfies PermissionMap;

export const StoreRole = {
  id: 3,
  name: { en: 'Store', ar: 'مركز' },
  key: 'store',
  default: true,
  permissions: mapPermissionConfigToRole(storePermissions),
};
