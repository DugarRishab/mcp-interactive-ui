import { z } from 'zod';

export const MAX_MARKDOWN_CHARS = 10_000;

export const markdownDataSchema = z
  .object({
    content: z.string().min(1).max(MAX_MARKDOWN_CHARS),
  })
  .strict();

export type MarkdownData = z.infer<typeof markdownDataSchema>;
