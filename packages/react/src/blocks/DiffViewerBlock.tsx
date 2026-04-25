import type { DiffViewerData } from '@mcp-interactive-ui/types';

export interface DiffViewerBlockProps {
  data: DiffViewerData;
  className?: string;
}

export function DiffViewerBlock({ data, className }: DiffViewerBlockProps): JSX.Element {
  const originalLines = data.original.split('\n');
  const modifiedLines = data.modified.split('\n');

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'}>
      {data.title && (
        <div className="p-4 border-b">
          <h3 className="text-sm font-semibold">{data.title}</h3>
        </div>
      )}

      <div className={`flex ${data.splitView ? '' : 'flex-col'} font-mono text-xs`}>
        {/* Original */}
        <div className={`flex-1 ${data.splitView ? 'border-r' : 'border-b'} bg-red-50 dark:bg-red-950/20`}>
          <div className="p-4 space-y-1">
            {originalLines.map((line, idx) => (
              <div key={idx} className="flex gap-2">
                {data.showLineNumbers && (
                  <span className="text-muted-foreground w-8 text-right">{idx + 1}</span>
                )}
                <span className="text-red-600">-</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Modified */}
        <div className="flex-1 bg-green-50 dark:bg-green-950/20">
          <div className="p-4 space-y-1">
            {modifiedLines.map((line, idx) => (
              <div key={idx} className="flex gap-2">
                {data.showLineNumbers && (
                  <span className="text-muted-foreground w-8 text-right">{idx + 1}</span>
                )}
                <span className="text-green-600">+</span>
                <span>{line}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
