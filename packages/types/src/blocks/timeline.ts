import { z } from 'zod';

export const timelineEventSchema = z.object({
  id: z.string(),
  timestamp: z.string(),
  title: z.string(),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.enum(['default', 'primary', 'success', 'warning', 'error']).default('default'),
  metadata: z.record(z.string()).optional(),
  links: z.array(z.object({
    label: z.string(),
    url: z.string().url(),
  })).optional(),
  media: z.object({
    type: z.enum(['image', 'video']),
    url: z.string().url(),
  }).optional(),
});

export const timelineDataSchema = z.object({
  title: z.string().optional(),
  orientation: z.enum(['vertical', 'horizontal']).default('vertical'),
  events: z.array(timelineEventSchema).min(1).max(100),
  groupBy: z.enum(['none', 'day', 'week', 'month', 'year']).default('none'),
  collapsible: z.boolean().default(false),
  maxVisible: z.number().optional(),
  reverse: z.boolean().default(false),
});

export type TimelineEvent = z.infer<typeof timelineEventSchema>;
export type TimelineData = z.infer<typeof timelineDataSchema>;
