import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  PORT: z.string(),
  DATABASE_URL: z.string().url(),
  API_KEY: z.string().min(32),
  MAPBOX_TOKEN: z.string().min(1),
  ALLOWED_ORIGINS: z.string(),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('900000'),
});

export const env = envSchema.parse({
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  DATABASE_URL: process.env.DATABASE_URL,
  API_KEY: process.env.API_KEY,
  MAPBOX_TOKEN: process.env.MAPBOX_TOKEN,
  ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS,
  RATE_LIMIT_MAX: process.env.RATE_LIMIT_MAX,
  RATE_LIMIT_WINDOW_MS: process.env.RATE_LIMIT_WINDOW_MS,
}); 