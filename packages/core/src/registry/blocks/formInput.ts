import { formInputDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const formInputBlock: BlockDefinition<'form_input'> = {
  id: 'form_input',
  type: 'form_input',
  name: 'Form Input',
  description:
    'Collect user input with forms. Supports various field types including text, email, select, checkbox, and more. Use when you need structured information from the user.',
  category: 'interactive',
  schema: formInputDataSchema,
  example: {
    title: 'Contact Information',
    description: 'Please fill out your contact details',
    fields: [
      { name: 'email', label: 'Email', type: 'email', required: true, disabled: false },
      { name: 'name', label: 'Full Name', type: 'text', required: true, disabled: false },
      { name: 'message', label: 'Message', type: 'textarea', required: false, disabled: false },
    ],
    submitLabel: 'Submit',
    cancelLabel: 'Cancel',
    layout: 'vertical',
    columns: 1,
  },
};
