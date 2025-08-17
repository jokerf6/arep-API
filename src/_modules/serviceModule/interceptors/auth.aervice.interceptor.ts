import {
  BadRequestException,
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { RolesKeys } from 'src/_modules/authorization/providers/roles';
import { FilterServiceDTO } from '../dto/service.dto';

@Injectable()
export class AuthServiceInterceptor implements NestInterceptor {
  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const request: Request & { user: CurrentUser; query: any } = context
      .switchToHttp()
      .getRequest();

    const user = request.user;
    const filters = request.query as FilterServiceDTO;
    if (user && user?.Role?.roleKey === RolesKeys.CUSTOMER) {
      filters.customerId = +user.id;
   
    }
   
    return next.handle();
  }
}
