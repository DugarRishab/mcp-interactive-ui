import { z } from 'zod';

export const kanbanCardSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  assignee: z.string().optional(),
  dueDate: z.string().optional(),
  tags: z.array(z.string()).optional(),
  metadata: z.record(z.string()).optional(),
});

export const kanbanColumnSchema = z.object({
  id: z.string(),
  title: z.string(),
  cards: z.array(kanbanCardSchema),
  color: z.string().optional(),
});

export const kanbanDataSchema = z.object({
  title: z.string().optional(),
  columns: z.array(kanbanColumnSchema).min(1).max(10),
  cardHeight: z.number().optional(),
});

export type KanbanCard = z.infer<typeof kanbanCardSchema>;
export type KanbanColumn = z.infer<typeof kanbanColumnSchema>;
export type KanbanData = z.infer<typeof kanbanDataSchema>;
