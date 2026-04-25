import { badgeGroupDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const badgeGroupBlock: BlockDefinition<'badge_group'> = {
  id: 'badge_group',
  type: 'badge_group',
  name: 'Badge Group',
  description:
    'Display a collection of badges or tags with various styles and layouts.',
  category: 'data',
  schema: badgeGroupDataSchema,
  example: {
    title: 'Tags',
    badges: [
      { id: 'b1', label: 'React', variant: 'secondary', removable: false },
      { id: 'b2', label: 'TypeScript', variant: 'outline', removable: false },
      { id: 'b3', label: 'Production', variant: 'default', removable: false }
    ],
    layout: 'wrap',
    size: 'md'
  },
};
