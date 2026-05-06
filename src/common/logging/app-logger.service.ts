import { Injectable } from '@nestjs/common';
import pino, { type Logger as PinoLogger } from 'pino';
import { env } from '../../config/env';
import type { LogContext } from './log-context';
import { RequestContextService } from './request-context.service';

type LogObject = Record<string, unknown>;

function resolveLogLevel(nodeEnv: string | undefined): pino.LevelWithSilent {
  return nodeEnv === 'production' ? 'info' : 'debug';
}

function compactUndefined<T extends LogObject>(obj: T): T {
  const out: LogObject = {};
  for (const [k, v] of Object.entries(obj)) {
    if (v !== undefined) out[k] = v;
  }
  return out as T;
}

@Injectable()
export class AppLogger {
  private readonly base: PinoLogger;

  constructor(private readonly requestContext: RequestContextService) {
    this.base = pino({
      level: resolveLogLevel(env.nodeEnv),
      messageKey: 'message',
      base: undefined,
      redact: {
        paths: [
          'req.headers.authorization',
          'authorization',
          '*.authorization',
          'token',
          '*.token',
          'accessToken',
          '*.accessToken',
          'refreshToken',
          '*.refreshToken',
          'password',
          '*.password',
          'secret',
          '*.secret',
          'credentials',
          '*.credentials',
        ],
        remove: true,
      },
    });
  }

  info(message: string, context: LogContext & LogObject = {}): void {
    this.base.info(this.enrich(context), message);
  }

  warn(message: string, context: LogContext & LogObject = {}): void {
    this.base.warn(this.enrich(context), message);
  }

  debug(message: string, context: LogContext & LogObject = {}): void {
    this.base.debug(this.enrich(context), message);
  }

  error(
    message: string,
    context: (LogContext & LogObject) | undefined,
    err?: unknown,
  ): void {
    const payload = this.enrich({
      ...(context ?? {}),
      ...(err instanceof Error
        ? { errorMessage: err.message, stack: err.stack, name: err.name }
        : err !== undefined
          ? { error: err }
          : {}),
    });
    this.base.error(payload, message);
  }

  private enrich(context: LogContext & LogObject): LogObject {
    const requestId = this.requestContext.getRequestId();
    const userId = this.requestContext.getUserId();
    return compactUndefined({
      requestId,
      userId,
      ...context,
    });
  }
}

