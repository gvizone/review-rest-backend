import type { LoggerService } from '@nestjs/common';
import { AppLogger } from './app-logger.service';

export class NestLoggerAdapter implements LoggerService {
  constructor(private readonly logger: AppLogger) {}

  log(message: unknown, context?: string): void {
    this.logger.info(String(message), context ? { context } : {});
  }

  error(message: unknown, stack?: string, context?: string): void {
    this.logger.error(
      String(message),
      context ? { context, stack } : { stack },
    );
  }

  warn(message: unknown, context?: string): void {
    this.logger.warn(String(message), context ? { context } : {});
  }

  debug(message: unknown, context?: string): void {
    this.logger.debug(String(message), context ? { context } : {});
  }

  verbose(message: unknown, context?: string): void {
    this.logger.debug(String(message), context ? { context } : {});
  }
}
