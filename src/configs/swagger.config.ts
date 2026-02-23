import { INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as fs from 'fs';
import * as path from 'path';

export const swaggerConfig = (app: INestApplication) => {
  const configService = app.get(ConfigService);
  const getEnv = (key: string) => configService.get<string>(key) || '';
  const prefix = getEnv('API_PREFIX') || '';
  const projectName = getEnv('PROJECT_NAME');
  

  const getMarkdown = (filePath: string) => {
    try {
      if (fs.existsSync(filePath)) {
        return fs.readFileSync(filePath, 'utf8');
      }
    } catch (e) {
      console.error(`Error reading markdown file: ${filePath}`, e);
    }
    return '';
  };

  const scanModuleGuides = () => {
    const modulesPaths = [
      path.join(process.cwd(), 'src/app/_modules'),
      path.join(process.cwd(), 'src/_modules'),
    ];

    const guides: { tag: string; description: string }[] = [];

    modulesPaths.forEach((basePath) => {
      if (!fs.existsSync(basePath)) return;

      const modules = fs.readdirSync(basePath);
      modules.forEach((moduleName) => {
        const modulePath = path.join(basePath, moduleName);
        if (!fs.statSync(modulePath).isDirectory()) return;

        // Find the first .md file in the module directory
        const files = fs.readdirSync(modulePath);
        const guideFile = files.find((f) => f.toLowerCase().endsWith('.md'));

        if (guideFile) {
          const content = getMarkdown(path.join(modulePath, guideFile));
          if (content) {
            // Standardize tag name (e.g., upload -> Upload, myModule -> Mymodule)
            const tagName = moduleName.charAt(0).toUpperCase() + moduleName.slice(1).toLowerCase();
            
            // Wrap in collapsible details for professional look
            const wrappedContent = `<details><summary>🔍 <b>${tagName} Integration Guide (Frontend)</b></summary>\n\n${content}\n\n</details>`;
            
            guides.push({ tag: tagName, description: wrappedContent });
          }
        }
      });
    });

    return guides;
  };

  const moduleGuides = scanModuleGuides();

  const createDocument = (name: string, urlPath: string, scopeName: string) => {
    const builder = new DocumentBuilder()
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
        schema: { type: 'boolean', default: false },
      });

    // Add module-specific guides to this document
    moduleGuides.forEach((guide) => {
      builder.addTag(guide.tag, guide.description);
    });

    const config = builder.build();
    const baseDocument = SwaggerModule.createDocument(app, config);
    
    const filteredDocument = {
      ...baseDocument,
      paths: Object.keys(baseDocument.paths).reduce((acc, key) => {
        const pathItem = baseDocument.paths[key];
        const newPathItem = {};
        let hasMethods = false;

        ['get', 'post', 'put', 'delete', 'patch', 'options', 'head'].forEach((method) => {
          if (pathItem[method]) {
            const operation = pathItem[method];
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

    SwaggerModule.setup(`${prefix}/docs/${urlPath}`, app, filteredDocument, {
      customSiteTitle: `${name} API`,
      swaggerOptions: {
        docExpansion: 'none',
        filter: true,
      },
    });
  };

  // Main (All)
  const mainBuilder = new DocumentBuilder()
    .setTitle(projectName)
    .setDescription('Main API Documentation')
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
    .addGlobalParameters({
        in: 'header',
        required: false,
        name: 'isLocalized',
        schema: { type: 'boolean', default: false },
      });

  // Add module-specific guides to main document
  moduleGuides.forEach((guide) => {
    mainBuilder.addTag(guide.tag, guide.description);
  });

  const mainConfig = mainBuilder.build();
  const mainDoc = SwaggerModule.createDocument(app, mainConfig);
  SwaggerModule.setup(`${prefix}/docs`, app, mainDoc);

  createDocument('Admin', 'admin', 'admin');
  createDocument('Customer', 'customer', 'customer');
  createDocument('Host', 'host', 'host');
};
