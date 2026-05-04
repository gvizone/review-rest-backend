import { Injectable } from '@nestjs/common';
import * as admin from 'firebase-admin';
import type { DecodedIdToken } from 'firebase-admin/auth';

@Injectable()
export class FirebaseTokenVerifier {
  verifyIdToken(idToken: string): Promise<DecodedIdToken> {
    return admin.auth().verifyIdToken(idToken);
  }
}
