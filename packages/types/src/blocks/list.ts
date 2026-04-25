import { z } from 'zod';

export const listItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  badge: z.string().optional(),
  badgeVariant: z.enum(['default', 'secondary', 'destructive', 'outline']).optional(),
  metadata: z.record(z.string()).optional(),
});

export const listDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(listItemSchema).min(1).max(100),
  type: z.enum(['ordered', 'unordered', 'checklist']).default('unordered'),
  separator: z.boolean().default(true),
  dense: z.boolean().default(false),
  hoverable: z.boolean().default(true),
});

export type ListItem = z.infer<typeof listItemSchema>;
export type ListData = z.infer<typeof listDataSchema>;
