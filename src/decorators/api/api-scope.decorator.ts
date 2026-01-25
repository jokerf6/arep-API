import { applyDecorators } from '@nestjs/common';
import { ApiExtension, ApiTags } from '@nestjs/swagger';
import { Auth } from 'src/_modules/authentication/decorators/auth.decorator';

export function AdminEndpoint(path: string, visitor = false) {
  return applyDecorators(
    ApiTags('Admin'),
    ApiExtension('x-scope-admin', true),
    Auth({ prefix: path, visitor }),
  );
}

export function CustomerEndpoint(path: string, visitor = false) {
  return applyDecorators(
    ApiTags('Customer'),
    ApiExtension('x-scope-customer', true),
    Auth({ prefix: path, visitor }),
  );
}

export function AllEndpoint() {
  return applyDecorators(
    ApiTags('Customer', 'Admin'),
    ApiExtension('x-scope-all', true),
  );
}

export function HostEndpoint(path: string, visitor = false) {
  return applyDecorators(
    ApiTags('Host'),
    ApiExtension('x-scope-host', true),
    Auth({ prefix: path, visitor }),
  );
}

