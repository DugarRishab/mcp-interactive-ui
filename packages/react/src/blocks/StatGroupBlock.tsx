import type { StatGroupData, StatDelta } from '@mcp-interactive-ui/types';

export interface StatGroupBlockProps {
  data: StatGroupData;
  className?: string;
}

function deltaClass(d: StatDelta): string {
  if (d.direction === 'up') return 'text-emerald-600 dark:text-emerald-400';
  if (d.direction === 'down') return 'text-rose-600 dark:text-rose-400';
  return 'text-muted-foreground';
}

function deltaArrow(d: StatDelta): string {
  if (d.direction === 'up') return '↑';
  if (d.direction === 'down') return '↓';
  return '→';
}

export function StatGroupBlock({ data, className }: StatGroupBlockProps): JSX.Element {
  return (
    <div className={className ?? 'grid gap-3 sm:grid-cols-2 lg:grid-cols-4'}>
      {data.items.map((item, i) => (
        <div
          key={i}
          className="rounded-lg border bg-card p-4 text-card-foreground shadow-sm"
        >
          <div className="text-sm text-muted-foreground">{item.label}</div>
          <div className="mt-1 text-2xl font-semibold tracking-tight">
            {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
          </div>
          {item.delta ? (
            <div className={`mt-1 text-xs ${deltaClass(item.delta)}`}>
              {deltaArrow(item.delta)} {item.delta.value}
              {item.delta.label ? ` ${item.delta.label}` : ''}
            </div>
          ) : null}
          {item.hint ? (
            <div className="mt-2 text-xs text-muted-foreground">{item.hint}</div>
          ) : null}
        </div>
      ))}
    </div>
  );
}
