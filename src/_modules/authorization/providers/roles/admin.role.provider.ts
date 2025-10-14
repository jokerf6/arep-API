import { mapPermissionConfigToRole } from '../../../../../src/globals/helpers/mapRoles.helper';
import { PermissionMap } from '../permissions.provider';

const adminPermissions: PermissionMap = {
  languages: ['post', 'get', 'delete', 'patch'],
  users: ['get', 'delete', 'patch'],
  roles: ['post', 'get', 'delete', 'patch'],
  profile: ['get', 'patch'],
  permissions: ['get', 'patch'],
  customers: ['post', 'get', 'delete', 'patch'],
  modules: ['post', 'get', 'patch', 'delete'],
  banners: ['post', 'get', 'patch', 'delete'],
  categories: ['post', 'get', 'patch', 'delete','manage'],
  subcategories: ['post', 'get', 'patch', 'delete'],
  stores: ['post', 'get', 'patch', 'delete'],
  services: ['post', 'get', 'patch', 'delete'],
  settings: ['get', 'patch'],
  'social-media': ['post', 'get', 'patch', 'delete'],
  'system-notifications': ['get', 'patch'],
  fund: ['post', 'get'],
  coupons: ['post', 'get', 'patch', 'delete'],
  addresses:['post','get','patch','delete'],
  employees:['post','get','patch','delete','manage'],
  schedule:['post','get','patch','delete','manage'],
  orders:['post','get','patch','delete','manage'],
  cities:['post','get','patch','delete','manage'],




} as const satisfies PermissionMap;

export const AdminRole = {
  id: 1,
  name: { en: 'Admin', ar: 'مشرف' },
  key: 'Admin',
  default: true,
  permissions: mapPermissionConfigToRole(adminPermissions),
};
