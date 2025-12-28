import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';

import {
  AcceptLanguageResolver,
  HeaderResolver,
  I18nModule,
  QueryResolver,
} from 'nestjs-i18n';
import * as path from 'path';
import { AuthenticationModule } from 'src/_modules/authentication/authentication.module';
import { AuthorizationModule } from 'src/_modules/authorization/authorization.module';
import { LanguagesModule } from 'src/_modules/languages/languages.module';
import { MediaModule } from 'src/_modules/media/media.module';
import { UserModule } from 'src/_modules/user/user.module';
import { GlobalModule } from 'src/globals/global.module';
import { LocaleMiddleware } from 'src/globals/middlewares/locale.middleware';
import { RateLimitMiddleware } from 'src/globals/middlewares/rate-limit.middleware';
import { XssMiddleware } from 'src/globals/middlewares/xss.middleware';
import { NotificationModule } from './_modules/notification/notification.module';
import { UploadModule } from './_modules/upload/upload.module';
import { SearchModule } from './_modules/search/search.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SwaggerDiffController } from './swagger/swagger-diff.controller';
import { NotificationMiddleware } from 'src/globals/middlewares/notification.middleware';
import { NotificationService } from 'src/globals/services/notification.service';
import { RedisModule } from './_modules/redis/redis.module';
import { WorkerModule } from './_modules/worker/worker.module';
import { BullModule } from '@nestjs/bull';
import { ScheduleModule } from '@nestjs/schedule';
import { FilterModule } from 'src/_modules/filter/filter.modules';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { MaintenanceInterceptor } from 'src/globals/interceptors/maintance.interceptor';
import { CityModule } from 'src/_modules/city/city.module';

const I18N_DIR = path.join(process.cwd(), './i18n');

@Module({
  imports: [
    ScheduleModule.forRoot(),
    I18nModule.forRootAsync({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: '.env',
        }),
      ],
      useFactory: (configService: ConfigService) => ({
        fallbackLanguage: configService.getOrThrow('FALLBACK_LANGUAGE'),
        loaderOptions: {
          path: I18N_DIR,
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang', 'local-lang']),
      ],
      inject: [ConfigService],
    }),

    GlobalModule,
    SearchModule,
    NotificationModule,
    UploadModule,
    MediaModule,
    AuthenticationModule,
    AuthorizationModule,
    UserModule,
    LanguagesModule,
    RedisModule,
    WorkerModule,
    FilterModule,
    CityModule,
  ],
  controllers: [AppController, SwaggerDiffController],
  providers: [AppService, NotificationService,
    {
      provide: APP_INTERCEPTOR,
      useClass: MaintenanceInterceptor,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LocaleMiddleware).forRoutes('*');
    consumer.apply(XssMiddleware).forRoutes('*');
    consumer.apply(RateLimitMiddleware).forRoutes('*');
    consumer.apply(NotificationMiddleware).forRoutes('*');
  }
}
