import { Injectable, type NestMiddleware } from '@nestjs/common';
import { randomUUID } from 'node:crypto';
import type { NextFunction, Request, Response } from 'express';
import { RequestContextService } from './request-context.service';

const REQUEST_ID_HEADER = 'x-request-id';

function normalizeHeaderValue(value: unknown): string | undefined {
  if (typeof value === 'string' && value.trim() !== '') return value.trim();
  if (Array.isArray(value)) {
    const first = value.find((v): v is string => typeof v === 'string');
    return first?.trim() ? first.trim() : undefined;
  }
  return undefined;
}

@Injectable()
export class RequestIdMiddleware implements NestMiddleware {
  constructor(private readonly requestContext: RequestContextService) {}

  use(req: Request, res: Response, next: NextFunction): void {
    const inbound = normalizeHeaderValue(req.headers[REQUEST_ID_HEADER]);
    const requestId = inbound ?? randomUUID();

    req.requestId = requestId;
    res.setHeader(REQUEST_ID_HEADER, requestId);

    const userId =
      typeof req.firebaseUser?.uid === 'string' ? req.firebaseUser.uid : undefined;

    this.requestContext.run({ requestId, userId }, () => next());
  }
}

