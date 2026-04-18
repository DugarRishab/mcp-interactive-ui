import { dataTableDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const dataTableBlock: BlockDefinition<'data_table'> = {
  id: 'data_table',
  type: 'data_table',
  name: 'Data Table',
  description:
    'Display structured, tabular data. Use for lists, comparisons, and records with consistent columns.',
  category: 'data',
  schema: dataTableDataSchema,
  example: {
    columns: [
      { key: 'name', header: 'Customer' },
      { key: 'revenue', header: 'Revenue', type: 'currency' },
    ],
    rows: [
      { name: 'Acme Corp', revenue: 50000 },
      { name: 'Tech Inc', revenue: 75000 },
    ],
  },
};
