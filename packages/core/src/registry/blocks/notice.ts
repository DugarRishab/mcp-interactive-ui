import { noticeDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const noticeBlock: BlockDefinition<'notice'> = {
  id: 'notice',
  type: 'notice',
  name: 'Notice',
  description:
    'Surface a short informational, success, warning, or error banner. Also used as the safe fallback for invalid or unsupported blocks.',
  category: 'feedback',
  schema: noticeDataSchema,
  example: {
    variant: 'info',
    title: 'Heads up',
    message: 'No records matched your filter.',
  },
};
