import './declares';
// organize-imports-disable-above
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { config } from 'dotenv';
import { I18nService } from 'nestjs-i18n';
import * as requestIp from 'request-ip';
import * as swStats from 'swagger-stats';

import { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from './app/app.module';
import { corsConfig } from './configs/cors.config';
import { morganMiddleware } from './configs/morgan.config';
import { globalValidationPipeOptions } from './configs/pipes.config';
import { swaggerConfig } from './configs/swagger.config';
import { GlobalExceptionFilter } from './globals/filters/global.exception.filter';
import { ResponseService } from './globals/services/response.service';
import { MaintenanceInterceptor } from './globals/interceptors/maintance.interceptor';
// import './instrument.ts';
import { lens } from '@lensjs/nestjs';

const environment = env('NODE_ENV') || 'development';
const envFileName = environment == 'production' ? '.env.prod' : '.env';
config({ path: envFileName, override: true });

async function bootstrap() {
  //
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfig,
    logger: environment !== 'production' ? ['error', 'warn', 'log'] : false,
  });

  const port = +env('PORT') || 3000;
  await lens({ app ,
    exceptionWatcherEnabled: true,
  });

  app.use(morganMiddleware);

  app.use(cookieParser(env('COOKIE_SECRET'), {}));
  const i18nService =
    app.get<I18nService<Record<string, unknown>>>(I18nService);
  const responseService = app.get(ResponseService);

  const prefix = env('API_PREFIX') || '';

  app.setGlobalPrefix(prefix);
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });

  // app.useLogger(new Logger()); // By default, it logs the requests

  app.useGlobalFilters(new GlobalExceptionFilter(i18nService, responseService));

  app.useGlobalPipes(new ValidationPipe(globalValidationPipeOptions));

 

  app.use(swStats.getMiddleware());
  app.set('trust proxy', true);

  app.use(
    requestIp.mw({
      attributeName: 'clientIp',
    }),
  );

  swaggerConfig(app);

  await app.listen(port, async () => {
    // await compareSwagger();
    // eslint-disable-next-line no-console
    console.info(`server is running on port ${port}`);
    // eslint-disable-next-line no-console
    console.info(
      `Swagger is running on http://localhost:${port}${prefix}/docs`,
    );
  });
}
bootstrap();
