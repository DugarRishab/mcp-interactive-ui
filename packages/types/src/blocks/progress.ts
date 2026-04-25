import { z } from 'zod';

export const progressStepSchema = z.object({
  id: z.string(),
  label: z.string(),
  description: z.string().optional(),
  status: z.enum(['pending', 'in_progress', 'completed', 'error', 'skipped']).optional(),
  icon: z.string().optional(),
  errorMessage: z.string().optional(),
  timestamp: z.string().optional(),
  metadata: z.record(z.string()).optional(),
});

export const progressDataSchema = z.object({
  title: z.string().optional(),
  variant: z.enum(['linear', 'circular', 'steps', 'vertical_steps']).optional(),
  value: z.number().min(0).max(100).optional(),
  max: z.number().optional(),
  indeterminate: z.boolean().optional(),
  showPercentage: z.boolean().optional(),
  size: z.enum(['sm', 'md', 'lg']).optional(),
  color: z.enum(['default', 'primary', 'success', 'warning', 'error']).optional(),
  steps: z.array(progressStepSchema).optional(),
  currentStep: z.string().optional(),
  clickable: z.boolean().optional(),
  label: z.string().optional(),
  sublabel: z.string().optional(),
});

export type ProgressStep = z.infer<typeof progressStepSchema>;
export type ProgressData = z.infer<typeof progressDataSchema>;
