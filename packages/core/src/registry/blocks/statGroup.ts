import { statGroupDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const statGroupBlock: BlockDefinition<'stat_group'> = {
  id: 'stat_group',
  type: 'stat_group',
  name: 'Stat Group',
  description:
    'Display a row of KPI tiles with optional delta indicators. Use for summary metrics (1-8 items).',
  category: 'data',
  schema: statGroupDataSchema,
  example: {
    items: [
      { label: 'MRR', value: '$42k', delta: { value: 8.5, direction: 'up' } },
      { label: 'Churn', value: '2.1%', delta: { value: 0.3, direction: 'down' } },
      { label: 'NPS', value: 62 },
    ],
  },
};
