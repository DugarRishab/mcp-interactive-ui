import { z } from 'zod';

export const noticeVariantSchema = z.enum(['info', 'success', 'warning', 'error']);

export const noticeDataSchema = z
  .object({
    variant: noticeVariantSchema,
    title: z.string().max(160).optional(),
    message: z.string().min(1).max(2000),
  })
  .strict();

export type NoticeVariant = z.infer<typeof noticeVariantSchema>;
export type NoticeData = z.infer<typeof noticeDataSchema>;
