import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';
import { getSecret } from 'src/config/secret-service';

/**
 * Production: Firebase service account JSON from AWS Secrets Manager `firebase-credentials`.
 * Non-production: JSON file path in `GOOGLE_APPLICATION_CREDENTIALS` (no AWS call).
 */
export async function bootstrapFirebaseAdmin(): Promise<void> {
  if (admin.apps.length > 0) {
    return;
  }

  if (process.env.NODE_ENV === 'production') {
    const credentials = await getSecret('firebase-credentials');
    admin.initializeApp({
      credential: admin.credential.cert(credentials as admin.ServiceAccount),
    });
    return;
  }

  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!gac) {
    throw new Error(
      'Set GOOGLE_APPLICATION_CREDENTIALS in development.env to your Firebase service account JSON path (avoids AWS Secrets Manager locally).',
    );
  }
  const keyPath = resolve(gac);
  if (!existsSync(keyPath)) {
    throw new Error(
      `GOOGLE_APPLICATION_CREDENTIALS file not found: ${keyPath} (cwd: ${process.cwd()})`,
    );
  }
  const json = JSON.parse(
    readFileSync(keyPath, 'utf8'),
  ) as admin.ServiceAccount;
  admin.initializeApp({
    credential: admin.credential.cert(json),
  });
}
