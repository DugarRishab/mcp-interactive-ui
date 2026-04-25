import { diffViewerDataSchema, type BlockDefinition } from '@mcp-interactive-ui/types';

export const diffViewerBlock: BlockDefinition<'diff_viewer'> = {
  id: 'diff_viewer',
  type: 'diff_viewer',
  name: 'Diff Viewer',
  description:
    'Display side-by-side or unified diff view for comparing code changes.',
  category: 'text',
  schema: diffViewerDataSchema,
  example: {
    original: "function sum(a, b) {\n  return a + b;\n}",
    modified: "function sum(a, b, c = 0) {\n  return a + b + c;\n}",
    language: 'javascript',
    showLineNumbers: true,
    splitView: true,
    highlightChanges: true,
    copyable: true
  },
};
