import {
  Injectable,
  type CallHandler,
  type ExecutionContext,
  type NestInterceptor,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { catchError, finalize, throwError } from 'rxjs';
import type { Observable } from 'rxjs';
import { AppLogger } from './app-logger.service';

@Injectable()
export class HttpLoggingInterceptor implements NestInterceptor {
  constructor(private readonly logger: AppLogger) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    if (context.getType() !== 'http') {
      return next.handle();
    }

    const startedAt = Date.now();
    const req = context.switchToHttp().getRequest<Request>();
    const res = context.switchToHttp().getResponse<Response>();

    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const requestId = req.requestId;

    let statusCodeOverride: number | undefined;

    return next.handle().pipe(
      catchError((err: unknown) => {
        const statusCode =
          typeof (err as { status?: unknown }).status === 'number'
            ? (err as { status: number }).status
            : typeof (err as { getStatus?: unknown }).getStatus === 'function'
              ? (err as { getStatus: () => number }).getStatus()
              : undefined;

        statusCodeOverride = statusCode;
        return throwError(() => err);
      }),
      finalize(() => {
        const durationMs = Date.now() - startedAt;
        const statusCode = statusCodeOverride ?? res.statusCode;

        this.logger.info('Request completed', {
          requestId,
          method,
          url,
          statusCode,
          durationMs,
        });
      }),
    );
  }
}

