import { DataType, SettingDomain } from '@prisma/client';

export type Setting = {
  setting: string;
  domain: SettingDomain;
  value: string;
  type: DataType;
  enum?: object;
};

export const settingTypes = [
  {
    // general
    setting: 'generalCopyRightTextAr',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.STRING,
  },
  {
    setting: 'generalCopyRightTextEn',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.STRING,
  },
  {
    setting: 'conditionsAndProvisionsEn',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.TEXTAREA,
  },
  {
    setting: 'conditionsAndProvisionsAr',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.TEXTAREA,
  },
  {
    setting: 'privatePolicyAr',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.TEXTAREA,
  },
  {
    setting: 'privatePolicyEn',
    domain: SettingDomain.BUSINESS,
    value: '',
    type: DataType.TEXTAREA,
  },

{
    setting: 'maintenance',
    domain: SettingDomain.BUSINESS,
    value: 'true',
    type: DataType.BOOLEAN,
  },

   // order  

  {
    setting: 'commissionIncluded',
    domain: SettingDomain.ORDER,
    type: DataType.BOOLEAN,
    value: 'true',
  },
  {
    setting: 'businessFreeDeliveryOver',
    domain: SettingDomain.ORDER,
    value: '4999.000000000000000000000000000000',
    type: DataType.NUMBER,
  },

  {
    setting: 'shippingKMCharge',
    domain: SettingDomain.ORDER,
    value: '2.000000000000000000000000000000',
    type: DataType.NUMBER,
  },

  {
    setting: 'storeConfirmOrder',
    domain: SettingDomain.ORDER,
    value: 'true',
    type: DataType.BOOLEAN,
  },




// Store

  {
    setting: 'businessOrderCommissionRateForAll',
    domain: SettingDomain.STORE,
    value: 'true',
    type: DataType.BOOLEAN,
  },


  {
    setting: 'businessOrderCommissionRate',
    domain: SettingDomain.STORE,
    value: '0.000000000000000000000000000000',
    type: DataType.NUMBER,
  },

  {
    setting: 'StoreTaxForAll',
    domain: SettingDomain.STORE,
    value: 'true',
    type: DataType.BOOLEAN,
  },


  {
    setting: 'StoreTaxRate',
    domain: SettingDomain.STORE,
    value: '0.000000000000000000000000000000',
    type: DataType.NUMBER,
  },

 {
    setting: 'storeNeedApproval',
    domain: SettingDomain.STORE,
    value: 'true',
    type: DataType.BOOLEAN,
  },
  {
    setting: 'storeNeedApprovalForServices',
    domain: SettingDomain.STORE,
    value: 'true',
    type: DataType.BOOLEAN,
  },
  {
    setting: 'storeNearestByKM',
    domain: SettingDomain.STORE,
    value: '10000',
    type: DataType.NUMBER,
  },


  // CUSTOMER
  {
    setting: 'customerLoyaltyPoints',
    domain: SettingDomain.CUSTOMER,
    value: 'true',
    type: DataType.BOOLEAN,
  },
  {
    setting: 'customer1PoundPoints',
    domain: SettingDomain.CUSTOMER,
    value: '1.000000000000000000000000000000',
    type: DataType.NUMBER,
  },
  {
    setting: 'customerOrderPoints',
    domain: SettingDomain.CUSTOMER,
    value: '2.000000000000000000000000000000',
    type: DataType.NUMBER,
  },
  {
    setting: 'customerMinPointsConvert',
    domain: SettingDomain.CUSTOMER,
    value: '2.000000000000000000000000000000',
    type: DataType.NUMBER,
  },
  

] as const satisfies readonly Setting[];

export const SettingKeys = settingTypes.map((s) => s.setting);

export type SettingKey = (typeof SettingKeys)[number];
