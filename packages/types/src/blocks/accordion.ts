import { z } from 'zod';

export const accordionItemSchema = z.object({
  id: z.string().min(1),
  title: z.string(),
  subtitle: z.string().optional(),
  // content is handled separately for recursive blocks
  icon: z.string().optional(),
  defaultOpen: z.boolean().optional(),
  disabled: z.boolean().optional(),
});

export const accordionDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  items: z.array(accordionItemSchema).min(1).max(20),
  type: z.enum(['single', 'multiple']).optional(),
  collapsible: z.boolean().optional(),
});

export type AccordionItem = z.infer<typeof accordionItemSchema>;
export type AccordionData = z.infer<typeof accordionDataSchema>;
