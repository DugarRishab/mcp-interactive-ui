import { markdownDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const markdownBlock: BlockDefinition<'markdown'> = {
  id: 'markdown',
  type: 'markdown',
  name: 'Markdown',
  description:
    'Long-form narrative text rendered as sanitized GitHub-flavored Markdown. Use for explanations, summaries, or multi-paragraph prose.',
  category: 'text',
  schema: markdownDataSchema,
  example: {
    content:
      '## Summary\n\nRevenue grew **12%** quarter-over-quarter, driven by enterprise upgrades.',
  },
};
