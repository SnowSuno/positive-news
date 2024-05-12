import { z } from 'zod';

const envSchema = z.object({
  NAVER_API_KEY_ID: z.string(),
  NAVER_API_KEY: z.string(),
});

export const env = envSchema.parse(process.env);
