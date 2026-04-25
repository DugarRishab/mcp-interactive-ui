import { z } from 'zod';

export const tabItemSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  icon: z.string().optional(),
  // content is handled separately for recursive blocks
  disabled: z.boolean().optional(),
  badge: z.string().optional(),
  tooltip: z.string().optional(),
});

export const tabsDataSchema = z.object({
  title: z.string().optional(),
  tabs: z.array(tabItemSchema).min(1).max(10),
  defaultTab: z.string().optional(),
  variant: z.enum(['default', 'outline', 'pills']).optional(),
  orientation: z.enum(['horizontal', 'vertical']).optional(),
  persistState: z.boolean().optional(),
});

export type TabItem = z.infer<typeof tabItemSchema>;
export type TabsData = z.infer<typeof tabsDataSchema>;
