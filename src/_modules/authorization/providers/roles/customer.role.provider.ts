import { mapPermissionConfigToRole } from '../../../../../src/globals/helpers/mapRoles.helper';
import { PermissionMap } from '../permissions.provider';

const customerPermissions: PermissionMap = {
  languages: ['get'],
  profile: ['post', 'get', 'patch'],
  modules: ['get'],
  addresses: ['post', 'get', 'patch', 'delete'],
  banners: ['get'],
  categories: ['get'],
  subcategories: ['get'],
  stores: ['get'],
  'stores/favourite': ['get', 'patch'],
  services: ['get'],
  'services/favourite': ['get', 'patch'],
  filters:['get'],
  'social-media': ['get'],
  coupons: [ 'get',],

} as const satisfies PermissionMap;

export const CustomerRole = {
  id: 2,
  name: { en: 'customer', ar: 'عميل' },
  key: 'Customer',
  default: true,
  permissions: mapPermissionConfigToRole(customerPermissions),
};
