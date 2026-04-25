import type { MetricCardData } from '@mcp-interactive-ui/types';

export interface MetricCardBlockProps {
  data: MetricCardData;
  className?: string;
}

export function MetricCardBlock({ data, className }: MetricCardBlockProps): JSX.Element {
  const colorClass = {
    default: 'text-foreground',
    primary: 'text-primary',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    error: 'text-red-600',
  }[data.color || 'default'];

  const sizeClass = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  }[data.size || 'md'];

  const isVertical = data.layout === 'vertical';

  return (
    <div
      className={`${className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'} ${sizeClass}`}
    >
      <div className={`flex ${isVertical ? 'flex-col' : 'flex-row items-center justify-between'} gap-4`}>
        <div className={isVertical ? '' : 'flex-1'}>
          <p className="text-sm text-muted-foreground">{data.title}</p>
          <div className={`text-3xl font-bold ${colorClass} mt-2`}>
            {data.value}
            {data.unit && <span className="text-lg ml-1">{data.unit}</span>}
          </div>
          {data.description && (
            <p className="text-xs text-muted-foreground mt-2">{data.description}</p>
          )}
        </div>

        {data.trend && (
          <div className={`text-right ${isVertical ? 'w-full' : ''}`}>
            <div
              className={`text-2xl font-bold ${
                data.trend.direction === 'up'
                  ? 'text-green-600'
                  : data.trend.direction === 'down'
                    ? 'text-red-600'
                    : 'text-muted-foreground'
              }`}
            >
              {data.trend.direction === 'up' && '↑'}
              {data.trend.direction === 'down' && '↓'}
              {data.trend.direction === 'neutral' && '→'}
              {data.trend.value}%
            </div>
            {data.trend.label && (
              <p className="text-xs text-muted-foreground mt-1">{data.trend.label}</p>
            )}
          </div>
        )}

        {data.icon && !data.trend && (
          <div className={`text-4xl ${colorClass}`}>{data.icon}</div>
        )}
      </div>
    </div>
  );
}
