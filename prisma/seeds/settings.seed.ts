// prisma/seeds/notificationSettings.ts
import {  PrismaClient } from '@prisma/client';
import { Setting, settingTypes } from 'src/_modules/settings/settings';

export async function seedSettings(prisma: PrismaClient) {
for (const setting of settingTypes as readonly Setting[]) {
      await this.prisma.settings.upsert({
        where: { setting: setting.setting },
        update: {},
        create: {
          setting: setting.setting,
          domain: setting.domain,
          value: setting.value,
          dataType: setting.type,
          enumValues: setting?.enum,
        },
      });
    }
  // eslint-disable-next-line no-console
  console.log('✅ Settings seeded');
}



