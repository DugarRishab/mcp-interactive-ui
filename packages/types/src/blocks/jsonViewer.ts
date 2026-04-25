import { z } from 'zod';

export const jsonViewerDataSchema = z.object({
  title: z.string().optional(),
  data: z.record(z.any()),
  collapsed: z.boolean().default(false),
  collapsible: z.boolean().default(true),
  copyable: z.boolean().default(true),
  searchable: z.boolean().default(true),
  maxDepth: z.number().optional(),
});

export type JsonViewerData = z.infer<typeof jsonViewerDataSchema>;
