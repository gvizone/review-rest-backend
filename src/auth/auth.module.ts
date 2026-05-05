import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import * as admin from 'firebase-admin';
import { bootstrapFirebaseAdmin } from './infrastructure/firebase-admin.bootstrap';
import { FirebaseTokenVerifier } from './infrastructure/firebase-token-verifier.service';

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
  private readonly logger = new Logger(AuthModule.name);

  async onModuleInit(): Promise<void> {
    await bootstrapFirebaseAdmin();
    this.logger.log(
      `Firebase Admin ready (projectId: ${admin.app().options.projectId ?? 'n/a'})`,
    );
  }
}
