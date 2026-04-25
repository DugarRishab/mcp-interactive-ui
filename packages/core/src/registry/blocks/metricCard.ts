import { metricCardDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const metricCardBlock: BlockDefinition<'metric_card'> = {
  id: 'metric_card',
  type: 'metric_card',
  name: 'Metric Card',
  description:
    'Display a single metric with trend indicator, sparkline, and comparison data.',
  category: 'data',
  schema: metricCardDataSchema,
  example: {
    title: 'Total Revenue',
    value: '$125,000',
    description: 'This month',
    trend: {
      direction: 'up',
      value: 12.5,
      label: 'vs last month'
    },
    color: 'default',
    size: 'md',
    layout: 'vertical'
  },
};
