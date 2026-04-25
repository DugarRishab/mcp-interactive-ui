import { useState } from 'react';
import type { JsonViewerData } from '@mcp-interactive-ui/types';

export interface JsonViewerBlockProps {
  data: JsonViewerData;
  className?: string;
}

function JsonValue({ value, depth = 0, maxDepth }: { value: any; depth?: number; maxDepth?: number }): JSX.Element {
  if (maxDepth && depth >= maxDepth) {
    return <span className="text-muted-foreground">...</span>;
  }

  if (value === null) return <span className="text-red-600">null</span>;
  if (typeof value === 'boolean') return <span className="text-blue-600">{String(value)}</span>;
  if (typeof value === 'number') return <span className="text-green-600">{value}</span>;
  if (typeof value === 'string') return <span className="text-orange-600">"{value}"</span>;

  if (Array.isArray(value)) {
    return (
      <div>
        <span>[</span>
        <div className="ml-4">
          {value.map((item, idx) => (
            <div key={idx}>
              <JsonValue value={item} depth={depth + 1} maxDepth={maxDepth} />
              {idx < value.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
        <span>]</span>
      </div>
    );
  }

  if (typeof value === 'object') {
    return (
      <div>
        <span>{'{'}</span>
        <div className="ml-4">
          {Object.entries(value).map(([key, val], idx, arr) => (
            <div key={key}>
              <span className="text-purple-600">"{key}"</span>
              <span>: </span>
              <JsonValue value={val} depth={depth + 1} maxDepth={maxDepth} />
              {idx < arr.length - 1 && <span>,</span>}
            </div>
          ))}
        </div>
        <span>{'}'}</span>
      </div>
    );
  }

  return <span>{String(value)}</span>;
}

export function JsonViewerBlock({ data, className }: JsonViewerBlockProps): JSX.Element {
  const [collapsed, setCollapsed] = useState(data.collapsed || false);

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {(data.title || data.collapsible) && (
        <div className="flex items-center justify-between p-4 border-b">
          {data.title && <h3 className="text-sm font-semibold">{data.title}</h3>}
          {data.collapsible && (
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-muted-foreground hover:text-foreground"
            >
              {collapsed ? '▶' : '▼'}
            </button>
          )}
        </div>
      )}

      {!collapsed && (
        <div className="p-4 font-mono text-sm overflow-x-auto bg-muted/50">
          <JsonValue value={data.data} maxDepth={data.maxDepth} />
        </div>
      )}
    </div>
  );
}
