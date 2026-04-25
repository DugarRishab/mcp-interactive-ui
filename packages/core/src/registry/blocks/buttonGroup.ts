import { buttonGroupDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const buttonGroupBlock: BlockDefinition<'button_group'> = {
  id: 'button_group',
  type: 'button_group',
  name: 'Button Group',
  description:
    'Present multiple action buttons to the user. Use for choices, confirmations, or action selection. Supports various button styles and layouts.',
  category: 'interactive',
  schema: buttonGroupDataSchema,
  example: {
    title: 'Choose an option',
    description: 'Select one of the following options',
    actions: [
      { id: 'option1', label: 'Option 1', variant: 'primary', size: 'md', disabled: false, loading: false, iconPosition: 'left' },
      { id: 'option2', label: 'Option 2', variant: 'secondary', size: 'md', disabled: false, loading: false, iconPosition: 'left' },
      { id: 'cancel', label: 'Cancel', variant: 'ghost', size: 'md', disabled: false, loading: false, iconPosition: 'left' },
    ],
    layout: 'horizontal',
    align: 'start',
  },
};
