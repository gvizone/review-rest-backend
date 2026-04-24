import { config } from 'dotenv';
import { resolve } from 'path';

config({ path: resolve(process.cwd(), '.env') });

const defaultCorsOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];

export const env = {
  nodeEnv: process.env.NODE_ENV ?? 'development',
  port: parseInt(process.env.PORT ?? '3000', 10),
  cors: {
    origins:
      process.env.CORS_ORIGINS?.split(',')
        .map((o) => o.trim())
        .filter(Boolean) ?? defaultCorsOrigins,
  },
  db: {
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USERNAME ?? 'root',
    password: process.env.DB_PASSWORD ?? '123456',
    database: process.env.DB_NAME ?? 'review_rest_db',
  },
} as const;
