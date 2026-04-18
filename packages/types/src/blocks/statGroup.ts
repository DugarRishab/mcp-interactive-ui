import { z } from 'zod';

export const MAX_STAT_ITEMS = 8;

export const statDeltaDirectionSchema = z.enum(['up', 'down', 'flat']);

export const statDeltaSchema = z.object({
  value: z.number(),
  direction: statDeltaDirectionSchema,
  label: z.string().max(60).optional(),
});

export const statItemSchema = z.object({
  label: z.string().min(1).max(80),
  value: z.union([z.string().max(60), z.number()]),
  hint: z.string().max(160).optional(),
  delta: statDeltaSchema.optional(),
});

export const statGroupDataSchema = z
  .object({
    items: z.array(statItemSchema).min(1).max(MAX_STAT_ITEMS),
  })
  .strict();

export type StatDeltaDirection = z.infer<typeof statDeltaDirectionSchema>;
export type StatDelta = z.infer<typeof statDeltaSchema>;
export type StatItem = z.infer<typeof statItemSchema>;
export type StatGroupData = z.infer<typeof statGroupDataSchema>;
