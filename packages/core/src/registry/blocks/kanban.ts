import { kanbanDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const kanbanBlock: BlockDefinition<'kanban'> = {
  id: 'kanban',
  type: 'kanban',
  name: 'Kanban Board',
  description:
    'Display read-only kanban board with columns and task cards.',
  category: 'data',
  schema: kanbanDataSchema,
  example: {
    columns: [
      {
        id: 'todo',
        title: 'To Do',
        cards: [
          { id: 'c1', title: 'Design review', tags: ['design'], assignee: 'Alice' },
          { id: 'c2', title: 'Write tests', tags: ['dev'] }
        ]
      },
      {
        id: 'in-progress',
        title: 'In Progress',
        cards: [
          { id: 'c3', title: 'Implement auth', tags: ['dev'], assignee: 'Bob' }
        ]
      },
      {
        id: 'done',
        title: 'Done',
        cards: [
          { id: 'c4', title: 'Setup repo', tags: ['dev'], assignee: 'Alice' }
        ]
      }
    ],
    cardHeight: 120
  },
};
