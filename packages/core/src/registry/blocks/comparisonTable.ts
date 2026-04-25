import { comparisonTableDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const comparisonTableBlock: BlockDefinition<'comparison_table'> = {
  id: 'comparison_table',
  type: 'comparison_table',
  name: 'Comparison Table',
  description:
    'Display side-by-side comparison of multiple items across different features.',
  category: 'data',
  schema: comparisonTableDataSchema,
  example: {
    title: 'Plan Comparison',
    columns: ['Feature', 'Basic', 'Pro', 'Enterprise'],
    rows: [
      { label: 'Price', items: ['$10', '$50', '$200'] },
      { label: 'Storage', items: ['10GB', '100GB', '1TB'] },
      { label: 'Support', items: ['No', 'Yes', 'Yes'] },
      { label: 'API Access', items: ['No', 'Yes', 'Yes'] }
    ],
    striped: true
  },
};
