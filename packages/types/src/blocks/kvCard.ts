import { z } from 'zod';

export const MAX_KV_FIELDS = 30;

export const kvFieldTypeSchema = z.enum(['text', 'badge', 'link']);

export const kvFieldSchema = z.object({
  label: z.string().min(1).max(120),
  value: z.string().min(1).max(500),
  type: kvFieldTypeSchema.optional(),
  href: z.string().url().optional(),
});

export const kvCardDataSchema = z
  .object({
    title: z.string().min(1).max(160),
    subtitle: z.string().max(240).optional(),
    fields: z.array(kvFieldSchema).min(1).max(MAX_KV_FIELDS),
  })
  .strict();

export type KVFieldType = z.infer<typeof kvFieldTypeSchema>;
export type KVField = z.infer<typeof kvFieldSchema>;
export type KVCardData = z.infer<typeof kvCardDataSchema>;
