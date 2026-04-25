import { jsonViewerDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const jsonViewerBlock: BlockDefinition<'json_viewer'> = {
  id: 'json_viewer',
  type: 'json_viewer',
  name: 'JSON Viewer',
  description:
    'Display collapsible JSON tree with syntax highlighting and search capability.',
  category: 'data',
  schema: jsonViewerDataSchema,
  example: {
    title: 'API Response',
    data: {
      user: { id: 1, name: 'John Doe', email: 'john@example.com' },
      status: 'active',
      roles: ['user', 'admin']
    },
    collapsed: false,
    collapsible: true,
    copyable: true,
    searchable: true,
    maxDepth: 3
  },
};
