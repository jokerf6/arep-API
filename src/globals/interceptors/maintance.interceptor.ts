import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  ForbiddenException,
} from '@nestjs/common';
import { Observable, of, from } from 'rxjs';
import { PrivateSettingService } from '../services/settings.service';

@Injectable()
export class MaintenanceInterceptor implements NestInterceptor {
  constructor(private readonly settingsService: PrivateSettingService) {}

  async intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Promise<Observable<any>> {
    const maintenance = (await this.settingsService.getSettings(['maintenance'])).maintenance;
    const maintenanceMode = env("MAINTENANCE");

    if (maintenance && maintenanceMode) {
        throw new ForbiddenException('The system is currently under maintenance. Please try again later.');

    }

    return next.handle();
  }
}
