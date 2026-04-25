import { tabsDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const tabsBlock: BlockDefinition<'tabs'> = {
  id: 'tabs',
  type: 'tabs',
  name: 'Tabs',
  description:
    'Organize content into tabbed sections. Each tab can contain nested blocks. Use for categorizing information or creating wizard-like interfaces.',
  category: 'interactive',
  schema: tabsDataSchema,
  example: {
    title: 'Product Details',
    tabs: [
      { id: 'overview', label: 'Overview', icon: 'info' },
      { id: 'specs', label: 'Specifications', badge: 'New' },
      { id: 'reviews', label: 'Reviews', disabled: false },
    ],
    defaultTab: 'overview',
    variant: 'default',
    orientation: 'horizontal',
    persistState: false,
  },
};
