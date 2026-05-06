import { Global, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import * as admin from 'firebase-admin';
import { bootstrapFirebaseAdmin } from './infrastructure/firebase-admin.bootstrap';
import { FirebaseTokenVerifier } from './infrastructure/firebase-token-verifier.service';
import { AppLogger } from '../common/logging/app-logger.service';

@Global()
@Module({
  providers: [
    FirebaseTokenVerifier,
    {
      provide: APP_GUARD,
      useClass: FirebaseAuthGuard,
    },
  ],
})
export class AuthModule implements OnModuleInit {
  constructor(private readonly logger: AppLogger) {}

  async onModuleInit(): Promise<void> {
    await bootstrapFirebaseAdmin();
    this.logger.info('Firebase Admin ready', {
      context: AuthModule.name,
      projectId: admin.app().options.projectId ?? 'n/a',
    });
  }
}
