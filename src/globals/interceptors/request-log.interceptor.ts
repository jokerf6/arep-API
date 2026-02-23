import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, throwError } from 'rxjs';
import { tap, catchError, finalize } from 'rxjs/operators';
import { PrismaService } from '../services/prisma.service';

@Injectable()
export class RequestLogInterceptor implements NestInterceptor {
  constructor(private readonly prisma: PrismaService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();

    return next.handle().pipe(
      tap({
        next: () => {
          setImmediate(() => this.logRequest(context, startTime));
        },
        error: (err) => {
          // Pass the error to logRequest
          setImmediate(() => this.logRequest(context, startTime, err));
        },
      }),
    );
  }

  private async logRequest(
    context: ExecutionContext,
    startTime: Date | number,
    exception?: any,
  ) {
    const request = context.switchToHttp().getRequest();
    const response = context.switchToHttp().getResponse();

    if (request.url.includes('request-logs')) {
      return;
    }

    const duration =
      Date.now() -
      (startTime instanceof Date ? startTime.getTime() : startTime);
    const statusCode = response.statusCode;
    const userId = request.user?.id || request.user?.userId || null;

    let info = null;
    if (exception) {
      info = {
        message: exception.message,
        stack: exception.stack,
        ...(exception.getResponse && { detail: exception.getResponse() }),
      };
    }

    try {
      await this.prisma.requestLog.create({
        data: {
          method: request.method,
          url: request.url,
          headers: request.headers as any,
          body:
            request.body && Object.keys(request.body).length > 0
              ? request.body
              : null,
          query:
            request.query && Object.keys(request.query).length > 0
              ? request.query
              : null,
          ip: request.clientIp || request.ip,
          userAgent: request.headers['user-agent'],
          userId: userId ? String(userId) : null,
          statusCode,
          duration,
          info: info as any,
        },
      });
    } catch (error) {
      // Silently fail to avoid disrupting the main request
    }
  }
}
