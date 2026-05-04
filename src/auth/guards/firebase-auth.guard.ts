import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { Request } from 'express';
import { IS_PUBLIC_KEY } from '../constants';
import { FirebaseTokenVerifier } from '../infrastructure/firebase-token-verifier.service';

@Injectable()
export class FirebaseAuthGuard implements CanActivate {
  private readonly logger = new Logger(FirebaseAuthGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly tokenVerifier: FirebaseTokenVerifier,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractBearerToken(request);
    if (!token) {
      throw new UnauthorizedException(
        'Missing or invalid Authorization header',
      );
    }

    try {
      const decoded = await this.tokenVerifier.verifyIdToken(token);
      request.firebaseUser = decoded;
      return true;
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`verifyIdToken failed: ${message}`);
      throw new UnauthorizedException('Invalid or expired Firebase ID token');
    }
  }

  private extractBearerToken(request: Request): string | undefined {
    const header = request.headers.authorization;
    if (!header || typeof header !== 'string') {
      return undefined;
    }
    const [type, value] = header.split(/\s+/, 2);
    if (type?.toLowerCase() !== 'bearer' || !value) {
      return undefined;
    }
    return value;
  }
}
