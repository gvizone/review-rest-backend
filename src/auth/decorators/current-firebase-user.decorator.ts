import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { DecodedIdToken } from 'firebase-admin/auth';

export const CurrentFirebaseUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): DecodedIdToken | undefined => {
    const req = ctx.switchToHttp().getRequest<Request>();
    return req.firebaseUser;
  },
);
