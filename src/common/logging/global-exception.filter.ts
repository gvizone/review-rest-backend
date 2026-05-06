import {
  Catch,
  type ArgumentsHost,
  type ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AppLogger } from './app-logger.service';

type HttpExceptionBody =
  | { message?: unknown; error?: unknown; statusCode?: unknown }
  | string
  | readonly unknown[]
  | undefined;

function toErrorMessage(exception: unknown): string {
  if (exception instanceof Error) return exception.message;
  return typeof exception === 'string' ? exception : 'Unexpected error';
}

function safeExceptionResponse(exception: HttpException): HttpExceptionBody {
  try {
    return exception.getResponse();
  } catch {
    return undefined;
  }
}

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: AppLogger) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const requestId = req.requestId;
    const method = req.method;
    const url = req.originalUrl ?? req.url;
    const userId =
      typeof req.firebaseUser?.uid === 'string'
        ? req.firebaseUser.uid
        : undefined;

    const statusCode =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const message = toErrorMessage(exception);

    const responseBody =
      exception instanceof HttpException
        ? safeExceptionResponse(exception)
        : undefined;

    this.logger.error(
      'Unhandled exception',
      {
        requestId,
        userId,
        method,
        url,
        statusCode,
        exceptionResponse:
          responseBody !== undefined && typeof responseBody !== 'string'
            ? responseBody
            : undefined,
      },
      exception,
    );

    if (res.headersSent) {
      return;
    }

    if (exception instanceof HttpException) {
      res.status(statusCode).json(responseBody);
      return;
    }

    res.status(statusCode).json({
      statusCode,
      message,
      requestId,
    });
  }
}
