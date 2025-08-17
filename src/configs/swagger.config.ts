import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

export const swaggerConfig = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const getEnv = (key: string) => configService.get<string>(key) || '';
  const prefix = getEnv('API_PREFIX') || '';

  const restApiConfig = new DocumentBuilder()
    .setTitle(getEnv('PROJECT_NAME'))
    .setDescription(getEnv('PROJECT_DESCRIPTION'))
    .setVersion('1.0')
    .setContact(
      getEnv('PROJECT_CONTACT_NAME'),
      getEnv('PROJECT_CONTACT_URL'),
      getEnv('PROJECT_CONTACT_EMAIL'),
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'ACCESS Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'REFRESH Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'PASSWORD_RESET Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'VERIFY Token',
    )
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
      },
      'VISITOR Token',
    )
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: 'Locale',
      schema: { example: 'en' },
    })
    .addGlobalParameters({
      in: 'header',
      required: false,
      name: 'isLocalized',
      schema: { example: false, type: 'boolean', enum: [true, false] },
    })
    .build();

  const restApiDocument = SwaggerModule.createDocument(app, restApiConfig);

  // Only setup once
  SwaggerModule.setup(`${prefix}/docs`, app, restApiDocument, {
    customSiteTitle: getEnv('PROJECT_NAME') + ' API Docs',
    customfavIcon: 'media?media=swagger.png',
    customCss: `
    .topbar-wrapper::after {
      content: " ${process.env.PROJECT_NAME} | Fahd Hakem - Website | Send email to Fahd Hakem | AutoNote";
      color: #a6e22e !important; /* Match curl URL color */
      font-size: 14px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 30px;
    }
  `,

    swaggerOptions: {
      docExpansion: 'none',
      filter: true,
    },
  });
  const outputPath = './swagger-spec.json'; // Path where the JSON will be saved
  fs.writeFileSync(outputPath, JSON.stringify(restApiDocument, null, 2), {
    encoding: 'utf8',
  });
  // eslint-disable-next-line no-console
  console.log(`Swagger JSON saved to ${outputPath}`);
};
