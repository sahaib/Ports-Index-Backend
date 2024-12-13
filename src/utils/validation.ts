import { z } from 'zod';

export const searchSchema = z.object({
  query: z.string().min(2).max(100),
  countryCode: z.string().length(2),
  limit: z.number().min(1).max(50).optional().default(10)
});

export const coordinateSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180)
});

export const validateSearchParams = (params: unknown) => {
  return searchSchema.parse(params);
}; 