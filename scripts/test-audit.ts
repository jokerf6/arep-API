import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../src/globals/services/prisma.service';
import { ClsModule, ClsService } from 'nestjs-cls';
import { GlobalModule } from '../src/globals/global.module';
import { INestApplication } from '@nestjs/common';
// import { AppModule } from '../src/app/app.module'; // Too big to load
// We just need PrismaService and ClsModule

// Mock SoftDelete/Sort middleware dependencies if they are not self-contained
// But they seem to be imported in PrismaService.

async function runTest() {
  console.log('Starting Audit Test...');

  const moduleRef: TestingModule = await Test.createTestingModule({
    imports: [
      ClsModule.forRoot({
        global: true,
        middleware: { mount: true },
      }),
    ],
    providers: [
      PrismaService,
    ],
  }).compile();

  const app = moduleRef.createNestApplication();
  const cls = app.get(ClsService);
  const prisma = app.get(PrismaService);
  
  await app.init();

  // Simulate Request Context
  await cls.run(async () => {
    // Set User
    cls.set('user', { id: 123, email: 'test@example.com' });
    console.log('User set in CLS:', cls.get('user'));

    // Create Entry (Use a simple generic if possible, or Order if we can satisfy constraints)
    // Order has relations (Address, User, Service etc). It's hard to create Order.
    // Let's create an AuditLog manually? No, we want to test TRIGGER.
    // Let's try to create a 'Role' or 'Language' or something simple.
    // Checking schema... Language seems simple? Or 'Banner'?
    
    // Let's try to use 'Module' or 'Permission' if simple.
    // Let's check 'Language' schema.
    
    try {
        console.log('Creating a test City...');
        const city = await prisma.city.create({
            data: {
                name: { en: 'TestCity', ar: 'TestCityAr' },
            }
        });
        console.log('Created City:', city.id);

        // Check Audit
        console.log('Checking Audit Log...');
        const audit = await prisma.auditLog.findFirst({
            where: {
                entityName: 'City',
                entityId: city.id.toString(),
                action: 'CREATE'
            }
        });

        if (audit) {
            console.log('SUCCESS: Audit Log found!');
            console.log(audit);
        } else {
            console.error('FAILURE: Audit Log NOT found.');
        }

        // Clean up
        await prisma.city.delete({ where: { id: city.id } });
        // Delete should also result in audit
        const auditDelete = await prisma.auditLog.findFirst({
             where: {
                entityName: 'City',
                entityId: city.id.toString(),
                action: 'DELETE'
            }
        });
         if (auditDelete) {
            console.log('SUCCESS: Audit Log (Delete) found!');
        } else {
            console.error('FAILURE: Audit Log (Delete) NOT found.');
        }

    } catch (e) {
        console.error('Test Failed', e);
    }
  });

  await app.close();
}

runTest();
