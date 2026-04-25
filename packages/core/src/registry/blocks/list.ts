import { listDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const listBlock: BlockDefinition<'list'> = {
  id: 'list',
  type: 'list',
  name: 'List',
  description:
    'Display ordered, unordered, or checklist items with support for nested lists.',
  category: 'layout',
  schema: listDataSchema,
  example: {
    type: 'checklist',
    title: 'Setup Tasks',
    items: [
      { id: '1', label: 'Install dependencies' },
      { id: '2', label: 'Configure environment' },
      { id: '3', label: 'Run tests' }
    ],
    separator: true,
    dense: false,
    hoverable: true
  },
};
