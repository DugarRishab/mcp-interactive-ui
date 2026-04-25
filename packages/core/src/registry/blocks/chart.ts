import { chartDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const chartBlock: BlockDefinition<'chart'> = {
  id: 'chart',
  type: 'chart',
  name: 'Chart',
  description:
    'Display data visualizations including bar, line, pie, doughnut, area, and radar charts.',
  category: 'data',
  schema: chartDataSchema,
  example: {
    type: 'bar',
    title: 'Monthly Sales',
    data: {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
      datasets: [
        { label: 'Sales', data: [120, 150, 180, 140, 200] }
      ]
    },
    options: {
      legend: true,
      tooltip: true,
      height: 300
    }
  },
};
