import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';

export const swaggerConfig = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const getEnv = (key: string) => configService.get<string>(key) || '';
  const prefix = getEnv('API_PREFIX') || '';
  const projectName = getEnv('PROJECT_NAME');
  

  const createDocument = (name: string, path: string, scopeName: string) => {
    const config = new DocumentBuilder()
      .setTitle(`${projectName} - ${name}`)
      .setDescription(`${name} API Documentation`)
      .setVersion('1.0')

    .setContact(
      getEnv('PROJECT_CONTACT_NAME'),
      getEnv('PROJECT_CONTACT_URL'),
      getEnv('PROJECT_CONTACT_EMAIL'),
    )
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'ACCESS Token')
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'REFRESH Token')
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'VERIFY Token')
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'PASSWORD_RESET Token')
      // Global Params
      .addGlobalParameters({
        in: 'header',
        required: false,
        name: 'Locale',
        schema: { example: 'en' },
      })
      .build();

    // Generate full document first (using the module inputs if we had them, or just app for deep scan)
    // Since we don't have separate modules passed here effectively yet, 
    // we create a document from the app and FILTER it.
    const baseDocument = SwaggerModule.createDocument(app, config);
    
    const filteredDocument = {
      ...baseDocument,
      paths: Object.keys(baseDocument.paths).reduce((acc, key) => {
        const pathItem = baseDocument.paths[key];
        // Check each method (get, post, etc.) for `x-doc-scope`
        // If ANY method in the path matches the scope, we keep the path (and filter methods inside? Ideally yes)
        // For simplicity, we filter methods.
        
        const newPathItem = {};
        let hasMethods = false;

        ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].forEach((method) => {
          if (pathItem[method]) {
            const operation = pathItem[method];
            // Check specific extension key for the scope
            // e.g. x-scope-admin, x-scope-customer
            const hasScope = operation[`x-scope-${scopeName}`];
            
            if (hasScope) {
              newPathItem[method] = operation;
              hasMethods = true;
            }
          }
        });

        if (hasMethods) {
          acc[key] = newPathItem;
        }
        return acc;
      }, {}),
    };

    SwaggerModule.setup(`${prefix}/docs/${path}`, app, filteredDocument, {
      customSiteTitle: `${name} API`,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
      },
    });
  };

  // Main (All)
  const mainConfig = new DocumentBuilder()
    .setTitle(projectName)
    .setDescription('Main API')
    .setVersion('1.0')
    .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'ACCESS Token')
         .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'REFRESH Token')
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'VERIFY Token')
      .addBearerAuth({ type: 'http', scheme: 'bearer' }, 'PASSWORD_RESET Token')
    .addGlobalParameters({
        in: 'header',
        required: false,
        name: 'Locale',
        schema: { example: 'en' },
      })
    .build();
    
  const mainDoc = SwaggerModule.createDocument(app, mainConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, mainDoc);

  createDocument('Admin', 'admin', 'admin');
  createDocument('Customer', 'customer', 'customer');
  createDocument('Host', 'host', 'host');
};
