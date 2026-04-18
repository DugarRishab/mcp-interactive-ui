import { kvCardDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const kvCardBlock: BlockDefinition<'kv_card'> = {
  id: 'kv_card',
  type: 'kv_card',
  name: 'Key-Value Card',
  description:
    'Show a single record as a labelled detail card. Use when the user asks about one entity.',
  category: 'data',
  schema: kvCardDataSchema,
  example: {
    title: 'Acme Corp',
    subtitle: 'Enterprise customer',
    fields: [
      { label: 'Status', value: 'Active', type: 'badge' },
      { label: 'Owner', value: 'Ada Lovelace' },
      { label: 'Website', value: 'acme.example', type: 'link', href: 'https://acme.example' },
    ],
  },
};
