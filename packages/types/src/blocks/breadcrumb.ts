import { z } from 'zod';

export const breadcrumbItemSchema = z.object({
  label: z.string(),
  href: z.string().optional(),
  icon: z.string().optional(),
  disabled: z.boolean().default(false),
});

export const breadcrumbDataSchema = z.object({
  items: z.array(breadcrumbItemSchema).min(1).max(20),
  separator: z.string().default('/'),
  showRoot: z.boolean().default(true),
});

export type BreadcrumbItem = z.infer<typeof breadcrumbItemSchema>;
export type BreadcrumbData = z.infer<typeof breadcrumbDataSchema>;
