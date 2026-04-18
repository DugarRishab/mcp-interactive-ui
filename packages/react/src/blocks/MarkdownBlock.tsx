import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize';
import type { MarkdownData } from '@mcp-interactive-ui/types';

export interface MarkdownBlockProps {
  data: MarkdownData;
  className?: string;
}

/**
 * Sanitizer allowlist: GFM basics + safe anchor schemes.
 * Disallows: <script>, <iframe>, inline styles, event handlers, non-http(s)/mailto hrefs.
 */
const sanitizeSchema = {
  ...defaultSchema,
  attributes: {
    ...defaultSchema.attributes,
    a: [
      ['href', /^(https?:|mailto:)/i],
      'title',
      ['target', '_blank'],
      ['rel', 'noopener noreferrer'],
    ],
    code: [...(defaultSchema.attributes?.code ?? []), 'className'],
  },
};

export function MarkdownBlock({ data, className }: MarkdownBlockProps): JSX.Element {
  return (
    <div className={className ?? 'prose prose-sm dark:prose-invert max-w-none'}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[[rehypeSanitize, sanitizeSchema]]}
      >
        {data.content}
      </ReactMarkdown>
    </div>
  );
}
