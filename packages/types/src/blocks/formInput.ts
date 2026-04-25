import { z } from 'zod';

export const formFieldSchema = z.object({
  name: z.string().min(1),
  label: z.string(),
  type: z.enum([
    'text', 'email', 'password', 'number', 'textarea',
    'select', 'multiselect', 'checkbox', 'radio',
    'date', 'datetime-local', 'time', 'url', 'tel', 'color'
  ]),
  required: z.boolean().optional(),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean(), z.array(z.string())]).optional(),
  options: z.array(z.object({
    label: z.string(),
    value: z.string(),
    disabled: z.boolean().optional(),
  })).optional(),
  validation: z.object({
    min: z.number().optional(),
    max: z.number().optional(),
    minLength: z.number().optional(),
    maxLength: z.number().optional(),
    pattern: z.string().optional(),
    customError: z.string().optional(),
  }).optional(),
  helpText: z.string().optional(),
  disabled: z.boolean().optional(),
});

export const formInputDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  fields: z.array(formFieldSchema).min(1).max(50),
  submitLabel: z.string().optional(),
  cancelLabel: z.string().optional(),
  resetLabel: z.string().optional(),
  layout: z.enum(['vertical', 'horizontal', 'grid']).optional(),
  columns: z.number().min(1).max(4).optional(),
});

export type FormField = z.infer<typeof formFieldSchema>;
export type FormInputData = z.infer<typeof formInputDataSchema>;
