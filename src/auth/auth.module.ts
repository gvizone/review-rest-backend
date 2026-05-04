import { Global, Logger, Module, OnModuleInit } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { FirebaseAuthGuard } from './guards/firebase-auth.guard';
import { initializeFirebaseAdmin } from './infrastructure/firebase-admin.initializer';
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

  onModuleInit(): void {
    const app = initializeFirebaseAdmin();
    this.logger.log(
      `Firebase Admin ready (projectId: ${app.options.projectId ?? 'from service account / ADC'})`,
    );
  }
}
