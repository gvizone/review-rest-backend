import { getSecret } from './secret-service';

/** Secret id in AWS Secrets Manager (JSON with DB fields). */
export const NESTJS_DB_SECRET_NAME = 'nestjs-db-secrets';

export type ResolvedDbConfig = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
};

function dbFromEnv(): ResolvedDbConfig {
  return {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '',
    database: process.env.DB_NAME ?? 'review_rest_db',
  };
}

function asString(value: unknown, field: string): string {
  if (typeof value === 'string' && value.length > 0) {
    return value;
  }
  throw new Error(
    `Secret "${NESTJS_DB_SECRET_NAME}": missing or invalid "${field}"`,
  );
}

function parseAwsDbSecret(raw: Record<string, unknown>): ResolvedDbConfig {
  const host = raw.host ?? raw.DB_HOST;
  const username = raw.username ?? raw.DB_USERNAME;
  const password = raw.password ?? raw.DB_PASSWORD;
  const database = raw.database ?? raw.DB_NAME ?? raw.dbname;
  const portRaw = raw.port ?? raw.DB_PORT ?? 3306;

  const port =
    typeof portRaw === 'number'
      ? portRaw
      : typeof portRaw === 'string'
        ? parseInt(portRaw, 10)
        : 3306;

  if (!Number.isFinite(port)) {
    throw new Error(`Secret "${NESTJS_DB_SECRET_NAME}": invalid port`);
  }

  return {
    host: asString(host, 'host'),
    port,
    username: asString(username, 'username'),
    password: asString(password, 'password'),
    database: asString(database, 'database'),
  };
}

/**
 * Non-production: reads `DB_*` from `.env` (via `dotenv` in `env.ts`).
 * Production (`NODE_ENV=production`): loads JSON from AWS Secrets Manager `nestjs-db-secrets`.
 *
 * Expected JSON keys (any one column name per row): `host` or `DB_HOST`, `username` or `DB_USERNAME`,
 * `password` or `DB_PASSWORD`, `database` or `DB_NAME` or `dbname`, `port` or `DB_PORT` (default 3306).
 */
export async function resolveDbConfig(): Promise<ResolvedDbConfig> {
  if (process.env.NODE_ENV !== 'production') {
    return dbFromEnv();
  }

  const raw = await getSecret(NESTJS_DB_SECRET_NAME);
  return parseAwsDbSecret(raw as Record<string, unknown>);
}
