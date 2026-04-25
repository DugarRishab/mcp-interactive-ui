import { z } from 'zod';

export const treeNodeSchema = z.lazy(() => z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  expanded: z.boolean().default(false),
  disabled: z.boolean().default(false),
  children: z.array(treeNodeSchema).optional(),
  metadata: z.record(z.string()).optional(),
})) as z.ZodType<{
  id: string;
  label: string;
  icon?: string;
  expanded?: boolean;
  disabled?: boolean;
  children?: z.infer<typeof treeNodeSchema>[];
  metadata?: Record<string, string>;
}>;

export const treeDataSchema = z.object({
  title: z.string().optional(),
  nodes: z.array(treeNodeSchema),
  expandAll: z.boolean().default(false),
  selectableNodes: z.boolean().default(false),
});

export type TreeNode = z.infer<typeof treeNodeSchema>;
export type TreeData = z.infer<typeof treeDataSchema>;
