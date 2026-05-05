import { config } from 'dotenv';
import { resolve } from 'path';

const nodeEnv = process.env.NODE_ENV ?? 'development';
config({ path: resolve(process.cwd(), `${nodeEnv}.env`) });

const defaultCorsOrigins = ['http://localhost:4200', 'http://127.0.0.1:4200'];

export const env = {
  nodeEnv: process.env.NODE_ENV,
  port: parseInt(process.env.PORT ?? '3000', 10),
  cors: {
    origins:
      process.env.CORS_ORIGINS?.split(',')
        .map((o) => o.trim())
        .filter(Boolean) ?? defaultCorsOrigins,
  },
} as const;
