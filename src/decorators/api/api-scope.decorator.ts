import { applyDecorators } from '@nestjs/common';
import { ApiExtension, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';

export function AdminEndpoint(path: string) {
  return applyDecorators(
    ApiTags('Admin'),
    ApiExtension('x-scope-admin', true),
    Auth({ prefix: path }),
  );
}

export function CustomerEndpoint(path: string) {
  return applyDecorators(
    ApiTags('Customer'),
    ApiExtension('x-scope-customer', true),
    Auth({ prefix: path }),
  );
}

export function AllEndpoint() {
  return applyDecorators(
    ApiTags('Customer', 'Admin'),
    ApiExtension('x-scope-all', true),
  );
}

export function HostEndpoint(path: string) {
  return applyDecorators(
    ApiTags('Host'),
    ApiExtension('x-scope-host', true),
    Auth({ prefix: path }),
  );
}

