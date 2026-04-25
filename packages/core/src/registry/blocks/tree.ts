import { treeDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const treeBlock: BlockDefinition<'tree'> = {
  id: 'tree',
  type: 'tree',
  name: 'Tree',
  description:
    'Display hierarchical tree structure with expand/collapse and optional selection.',
  category: 'layout',
  schema: treeDataSchema,
  example: {
    nodes: [
      {
        id: 'src',
        label: 'src',
        icon: 'Folder',
        expanded: true,
        children: [
          {
            id: 'components',
            label: 'components',
            icon: 'Folder',
            children: [
              { id: 'button', label: 'Button.tsx', icon: 'File' },
              { id: 'card', label: 'Card.tsx', icon: 'File' }
            ]
          },
          { id: 'index', label: 'index.ts', icon: 'File' }
        ]
      }
    ],
    expandAll: false,
    selectableNodes: true
  },
};
