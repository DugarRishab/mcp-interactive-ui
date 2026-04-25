import { z } from 'zod';

export const comparisonRowSchema = z.object({
  label: z.string(),
  items: z.array(z.union([z.string(), z.number(), z.boolean()])).min(2).max(5),
});

export const comparisonTableDataSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  columns: z.array(z.string()).min(2).max(5),
  rows: z.array(comparisonRowSchema).min(1).max(50),
  highlightColumn: z.number().optional(),
  striped: z.boolean().default(true),
});

export type ComparisonRow = z.infer<typeof comparisonRowSchema>;
export type ComparisonTableData = z.infer<typeof comparisonTableDataSchema>;
