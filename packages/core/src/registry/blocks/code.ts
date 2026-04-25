import { codeDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const codeBlock: BlockDefinition<'code'> = {
  id: 'code',
  type: 'code',
  name: 'Code',
  description:
    'Display syntax-highlighted code with optional line numbers, copy button, and collapsible sections.',
  category: 'text',
  schema: codeDataSchema,
  example: {
    content: "function hello() {\n  return 'world';\n}",
    language: 'javascript',
    filename: 'example.js',
    showLineNumbers: true,
    copyable: true,
    collapsible: false,
    wrapLines: false,
    collapsed: false,
  },
};
