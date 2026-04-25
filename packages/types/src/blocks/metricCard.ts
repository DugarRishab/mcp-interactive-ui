import { z } from 'zod';

export const metricCardDataSchema = z.object({
  title: z.string(),
  value: z.union([z.string(), z.number()]),
  unit: z.string().optional(),
  description: z.string().optional(),
  icon: z.string().optional(),
  trend: z.object({
    direction: z.enum(['up', 'down', 'neutral']),
    value: z.number(),
    label: z.string().optional(),
  }).optional(),
  color: z.enum(['default', 'primary', 'success', 'warning', 'error']).default('default'),
  size: z.enum(['sm', 'md', 'lg']).default('md'),
  layout: z.enum(['vertical', 'horizontal']).default('vertical'),
});

export type MetricCardData = z.infer<typeof metricCardDataSchema>;
