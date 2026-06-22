import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { StructuredLogger, redactSensitive } from '../utils/logger';

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new StructuredLogger();

  constructor() {
    this.logger.setContext('HTTP');
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();
    const { method, url, body, query } = request;
    const start = Date.now();

    this.logger.log('Incoming request', {
      method,
      url,
      query,
      body: body ? redactSensitive(body) : undefined,
    });

    return next.handle().pipe(
      tap({
        next: (data) => {
          this.logger.log('Request completed', {
            method,
            url,
            statusCode: context.switchToHttp().getResponse().statusCode,
            durationMs: Date.now() - start,
            responseSize: data ? JSON.stringify(data).length : 0,
          });
        },
        error: (error) => {
          this.logger.error('Request failed', error?.stack, {
            method,
            url,
            durationMs: Date.now() - start,
          });
        },
      }),
    );
  }
}
