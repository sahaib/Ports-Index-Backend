import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  MAPBOX_TOKEN: z.string().min(1),
  NODE_ENV: z.string().default('development'),
});

export const env = envSchema.parse(process.env); 