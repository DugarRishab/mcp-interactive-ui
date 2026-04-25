import { z } from 'zod';

export const chartDatasetSchema = z.object({
  label: z.string(),
  data: z.array(z.number()),
  color: z.string().optional(),
});

export const chartDataSchema = z.object({
  type: z.enum(['bar', 'line', 'pie', 'doughnut', 'area', 'radar']),
  title: z.string().optional(),
  description: z.string().optional(),
  data: z.object({
    labels: z.array(z.string()),
    datasets: z.array(chartDatasetSchema).min(1).max(5),
  }),
  options: z.object({
    legend: z.boolean().optional(),
    tooltip: z.boolean().optional(),
    grid: z.boolean().optional(),
    stacked: z.boolean().optional(),
    xAxisLabel: z.string().optional(),
    yAxisLabel: z.string().optional(),
    height: z.number().optional(),
    animations: z.boolean().optional(),
  }).optional(),
});

export type ChartDataset = z.infer<typeof chartDatasetSchema>;
export type ChartData = z.infer<typeof chartDataSchema>;
