import { z } from 'zod';
import { normalizedBlockSchema } from './blocks/index.js';

export const metadataSchema = z
  .object({
    model: z.string().optional(),
    latency_ms: z.number().nonnegative().optional(),
  })
  .passthrough();

export const normalizedAIResponseSchema = z
  .object({
    text: z.string().optional(),
    blocks: z.array(normalizedBlockSchema),
    metadata: metadataSchema.optional(),
  })
  .strict();

export type NormalizedAIResponse = z.infer<typeof normalizedAIResponseSchema>;
export type ResponseMetadata = z.infer<typeof metadataSchema>;
