import { accordionDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const accordionBlock: BlockDefinition<'accordion'> = {
  id: 'accordion',
  type: 'accordion',
  name: 'Accordion',
  description:
    'Collapsible sections that can contain nested blocks. Use for FAQs, settings panels, or progressive disclosure of content.',
  category: 'interactive',
  schema: accordionDataSchema,
  example: {
    title: 'FAQ',
    description: 'Frequently asked questions about our product.',
    items: [
      { id: 'q1', title: 'What is included?', subtitle: 'Package contents', defaultOpen: true, disabled: false },
      { id: 'q2', title: 'How do I get support?', icon: 'help', disabled: false },
      { id: 'q3', title: 'What is the refund policy?', disabled: false },
    ],
    type: 'single',
    collapsible: true,
  },
};
