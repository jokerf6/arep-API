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
  categories: [ 'get','post','patch' ],
  subcategories: [ 'get','post','patch' ],
  stores: [ 'get', 'patch', ],
  services: ['post', 'get', 'patch', 'delete'],
  'social-media': [ 'get',],
  'system-notifications': ['get', 'patch'],
  fund: ['post', 'get'],
  coupons: ['get', ],

  employees: ['post', 'get','delete', 'patch',],
  schedule:['post','get','patch','delete',],

  orders:['post','get','patch','delete',],

  cities:['get',],
servicerating:['get',],
storerating:['get',],
  banks:['get',],
  bankAccounts:['post','get','patch','delete',],


} as const satisfies PermissionMap;

export const StoreRole = {
  id: 3,
  name: { en: 'Store', ar: 'مركز' },
  key: 'Store',
  default: true,
  permissions: mapPermissionConfigToRole(storePermissions),
};
