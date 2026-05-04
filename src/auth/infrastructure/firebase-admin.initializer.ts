import { existsSync, readFileSync } from 'fs';
import { resolve } from 'path';
import * as admin from 'firebase-admin';

type ServiceAccountFile = {
  project_id?: string;
  projectId?: string;
};

function readProjectIdFromKeyFile(keyPath: string): string | undefined {
  try {
    const parsed = JSON.parse(
      readFileSync(keyPath, 'utf8'),
    ) as ServiceAccountFile;
    return parsed.projectId ?? parsed.project_id;
  } catch {
    return undefined;
  }
}

/**
 * Initializes Firebase Admin from `GOOGLE_APPLICATION_CREDENTIALS` (path to the service account JSON).
 * Paths are resolved from `process.cwd()`.
 *
 * Optional `FIREBASE_PROJECT_ID` overrides the `project_id` from the JSON (must match the client Firebase project).
 *
 * Load env before this runs (`main.ts` → `dotenv/config`).
 */
export function initializeFirebaseAdmin(): admin.app.App {
  if (admin.apps.length > 0) {
    return admin.app();
  }

  const gac = process.env.GOOGLE_APPLICATION_CREDENTIALS?.trim();
  if (!gac) {
    throw new Error(
      'Firebase Admin: set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON file path.',
    );
  }

  const keyPath = resolve(gac);
  if (!existsSync(keyPath)) {
    throw new Error(
      `GOOGLE_APPLICATION_CREDENTIALS file not found: ${keyPath} (cwd: ${process.cwd()})`,
    );
  }

  const envProjectId = process.env.FIREBASE_PROJECT_ID;
  const resolvedProjectId = envProjectId ?? readProjectIdFromKeyFile(keyPath);
  if (!resolvedProjectId) {
    throw new Error(
      `Firebase Admin: could not read project_id from ${keyPath}. Set FIREBASE_PROJECT_ID in .env.`,
    );
  }

  return admin.initializeApp({
    credential: admin.credential.cert(keyPath),
    projectId: resolvedProjectId,
  });
}
