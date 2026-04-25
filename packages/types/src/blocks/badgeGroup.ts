import { z } from 'zod';

export const badgeItemSchema = z.object({
  id: z.string(),
  label: z.string(),
  variant: z.enum(['default', 'secondary', 'destructive', 'outline', 'success', 'warning']).default('default'),
  icon: z.string().optional(),
  removable: z.boolean().default(false),
});

export const badgeGroupDataSchema = z.object({
  title: z.string().optional(),
  badges: z.array(badgeItemSchema).min(1).max(50),
  layout: z.enum(['horizontal', 'vertical', 'wrap']).default('wrap'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
});

export type BadgeItem = z.infer<typeof badgeItemSchema>;
export type BadgeGroupData = z.infer<typeof badgeGroupDataSchema>;
