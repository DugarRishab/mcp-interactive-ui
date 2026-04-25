import { z } from 'zod';

export const buttonActionSchema = z.object({
  id: z.string().min(1),
  label: z.string(),
  variant: z.enum(['primary', 'secondary', 'danger', 'ghost', 'outline', 'link']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  icon: z.string().optional(),
  iconPosition: z.enum(['left', 'right']).optional(),
  disabled: z.boolean().optional(),
  loading: z.boolean().optional(),
  confirmation: z.object({
    title: z.string(),
    message: z.string(),
    confirmLabel: z.string().optional(),
    cancelLabel: z.string().optional(),
    variant: z.enum(['default', 'danger']).optional(),
  }).optional(),
  description: z.string().optional(),
});

export const buttonGroupDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  actions: z.array(buttonActionSchema).min(1).max(10),
  layout: z.enum(['horizontal', 'vertical', 'grid']).optional(),
  align: z.enum(['start', 'center', 'end', 'stretch']).optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
});

export type ButtonAction = z.infer<typeof buttonActionSchema>;
export type ButtonGroupData = z.infer<typeof buttonGroupDataSchema>;
