import { z } from 'zod';

export const codeDataSchema = z.object({
  content: z.string().max(50000),
  language: z.string().default('text'),
  filename: z.string().optional(),
  showLineNumbers: z.boolean().default(true),
  highlightLines: z.array(z.number()).optional(),
  wrapLines: z.boolean().default(false),
  copyable: z.boolean().default(true),
  collapsible: z.boolean().default(false),
  collapsed: z.boolean().default(false),
  maxHeight: z.number().optional(),
  diff: z.object({
    original: z.string(),
    modified: z.string(),
    language: z.string(),
  }).optional(),
});

export type CodeData = z.infer<typeof codeDataSchema>;
