import { z } from 'zod';

export const treeNodeSchema: z.ZodType<any> = z.lazy(() => z.object({
  id: z.string(),
  label: z.string(),
  icon: z.string().optional(),
  expanded: z.boolean().default(false),
  disabled: z.boolean().default(false),
  children: z.array(treeNodeSchema).optional(),
  metadata: z.record(z.string()).optional(),
}));

export const treeDataSchema = z.object({
  title: z.string().optional(),
  nodes: z.array(treeNodeSchema),
  expandAll: z.boolean().default(false),
  selectableNodes: z.boolean().default(false),
});

export type TreeNode = z.infer<typeof treeNodeSchema>;
export type TreeData = z.infer<typeof treeDataSchema>;
