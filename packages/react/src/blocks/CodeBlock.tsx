import { useState, useCallback } from 'react';
import type { CodeData } from '@mcp-interactive-ui/types';

export interface CodeBlockProps {
  data: CodeData;
  className?: string;
}

/**
 * Renders a `code` block with syntax highlighting and copy functionality.
 */
export function CodeBlock({ data, className }: CodeBlockProps): JSX.Element {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(data.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [data.content]);

  const lines = data.content.split('\n');
  const startLine = 1;
  const maxLineNumberWidth = String(lines.length).length;

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'}>
      {/* Header */}
      {(data.filename || data.copyable) && (
        <div className="flex items-center justify-between px-4 py-2 bg-muted border-b">
          {data.filename && (
            <span className="text-sm font-mono text-muted-foreground">{data.filename}</span>
          )}
          {data.copyable && (
            <button
              onClick={handleCopy}
              className="ml-auto inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-8 px-3 py-1"
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          )}
        </div>
      )}

      {/* Code */}
      <div className="overflow-x-auto bg-background">
        <pre className="p-4 text-sm font-mono text-foreground">
          {lines.map((line, idx) => {
            const lineNumber = startLine + idx;
            const isHighlighted = data.highlightLines?.includes(lineNumber);

            return (
              <div
                key={idx}
                className={`${
                  isHighlighted ? 'bg-yellow-500/10' : ''
                } ${data.showLineNumbers ? 'flex' : ''}`}
              >
                {data.showLineNumbers && (
                  <span
                    className="inline-block w-12 pr-4 text-right text-muted-foreground select-none"
                    style={{ minWidth: `${maxLineNumberWidth * 0.6 + 2}rem` }}
                  >
                    {lineNumber}
                  </span>
                )}
                <span className={data.wrapLines ? 'break-words' : 'whitespace-pre'}>
                  {line}
                </span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}
