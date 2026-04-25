import { timelineDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const timelineBlock: BlockDefinition<'timeline'> = {
  id: 'timeline',
  type: 'timeline',
  name: 'Timeline',
  description:
    'Display chronological events in vertical or horizontal orientation with icons and color coding.',
  category: 'data',
  schema: timelineDataSchema,
  example: {
    title: 'Project Milestones',
    orientation: 'vertical',
    reverse: false,
    collapsible: false,
    groupBy: 'none',
    events: [
      {
        id: 'e1',
        timestamp: '2024-01-01',
        title: 'Project Kickoff',
        description: 'Initial planning completed',
        color: 'success'
      },
      {
        id: 'e2',
        timestamp: '2024-02-15',
        title: 'Beta Release',
        description: 'First version shipped',
        color: 'primary'
      }
    ]
  },
};
