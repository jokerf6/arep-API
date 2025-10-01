export const permissions = [
  {
    name: { en: 'Languages', ar: 'اللغات' },
    prefix: 'languages',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },
  {
    name: { en: 'Users', ar: 'المستخدمين' },
    prefix: 'users',
    default: false,
    methods: ['get', 'delete', 'patch'],
  },
  {
    name: { en: 'Roles', ar: 'الادوار' },
    prefix: 'roles',
    default: false,
    methods: ['post', 'get', 'delete', 'patch'],
  },
  {
    name: { en: 'Profile', ar: 'الحساب الشخصي' },
    prefix: 'profile',
    default: true,
    methods: ['post', 'get', 'patch','delete'],
  },
  {
    name: { en: 'Permissions', ar: 'الصلاحيات' },
    prefix: 'permissions',
    default: false,
    methods: ['get', 'patch'],
  },
  {
    name: { en: 'Customers', ar: 'العملاء' },
    prefix: 'customers',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Modules', ar: 'الوحدات' },
    prefix: 'modules',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Addresses', ar: 'العناوين' },
    prefix: 'addresses',
    default: true,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Banners', ar: 'البانرات' },
    prefix: 'banners',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Categories', ar: 'الفئات' },
    prefix: 'categories',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },

  {
    name: { en: 'SubCategories', ar: 'الفئات الفرعية' },
    prefix: 'subcategories',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Stores', ar: 'المتاجر' },
    prefix: 'stores',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  {
    name: { en: 'Store Favourite', ar: 'المتجر المفضل' },
    prefix: 'stores/favourite',
    default: true,
    methods: ['get', 'patch'],
  },

  {
    name: { en: 'Service', ar: 'الخدمات' },
    prefix: 'services',
    default: false,
    methods: ['post', 'get', 'patch', 'delete','manage'],
  },
  {
    name: { en: 'Service Favourite', ar: 'الخدمات المفضلة' },
    prefix: 'services/favourite',
    default: true,
    methods: ['get', 'patch'],
  },
  {
    name: { en: 'filters', ar: 'الفلاتر' },
    prefix: 'filters',
    default: true,
    methods: ['get'],
  },
  {
    name: { en: 'settings', ar: 'الإعدادات' },
    prefix: 'settings',
    default: false,
    methods: ['get', 'patch'],
  },
  {
    name: { en: 'Social Media', ar: 'وسائل التواصل الاجتماعي' },
    prefix: 'social-media',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
    {
    name: { en: 'System Notifications', ar: 'إشعارات النظام' },
    prefix: 'system-notifications',
    default: false,
    methods: ['get', 'patch',],
  },
   {
    name: { en: 'Fund', ar: 'رصيد المحفظة' },
    prefix: 'fund',
    default: false,
    methods: ['post', 'get'],
  },
     {
    name: { en: 'Coupons', ar: 'القسائم' },
    prefix: 'coupons',
    default: false,
    methods: ['post', 'get', 'patch', 'delete'],
  },
  
];

type Permission = (typeof permissions)[number];

export type PermissionMethod = 'get' | 'post' | 'put' | 'patch' | 'delete'|'manage';

export type PermissionMap = Record<Permission['prefix'], PermissionMethod[]>;
