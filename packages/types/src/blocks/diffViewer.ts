import { z } from 'zod';

export const diffViewerDataSchema = z.object({
  title: z.string().optional(),
  original: z.string(),
  modified: z.string(),
  language: z.string().default('text'),
  showLineNumbers: z.boolean().default(true),
  splitView: z.boolean().default(true),
  highlightChanges: z.boolean().default(true),
  copyable: z.boolean().default(true),
});

export type DiffViewerData = z.infer<typeof diffViewerDataSchema>;
