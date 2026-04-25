import { modalDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const modalBlock: BlockDefinition<'modal'> = {
  id: 'modal',
  type: 'modal',
  name: 'Modal',
  description:
    'Popup dialog that can contain nested blocks. Use for confirmations, detailed views, or focused interactions.',
  category: 'interactive',
  schema: modalDataSchema,
  example: {
    id: 'confirm-modal',
    isOpen: true,
    title: 'Confirm Action',
    description: 'Are you sure you want to proceed?',
    size: 'md',
    variant: 'confirm',
    footer: {
      showCloseButton: true,
      closeLabel: 'Cancel',
      actions: [
        { id: 'confirm', label: 'Confirm', variant: 'default', primary: true },
        { id: 'cancel', label: 'Cancel', variant: 'secondary' },
      ],
    },
    closeOnOverlayClick: true,
    closeOnEsc: true,
    preventScroll: true,
  },
};
