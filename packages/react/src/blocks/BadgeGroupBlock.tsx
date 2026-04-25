import type { BadgeGroupData } from '@mcp-interactive-ui/types';

export interface BadgeGroupBlockProps {
  data: BadgeGroupData;
  className?: string;
}

export function BadgeGroupBlock({ data, className }: BadgeGroupBlockProps): JSX.Element {
  const layoutClass = {
    horizontal: 'flex flex-row gap-2',
    vertical: 'flex flex-col gap-2',
    wrap: 'flex flex-wrap gap-2',
  }[data.layout || 'wrap'];

  const sizeClass = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-1.5',
    lg: 'text-base px-3 py-2',
  }[data.size || 'md'];

  const variantClass = (variant: string) => {
    switch (variant) {
      case 'destructive':
        return 'bg-destructive text-destructive-foreground';
      case 'outline':
        return 'border border-input bg-background';
      case 'success':
        return 'bg-green-500 text-white';
      case 'warning':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {data.title && (
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      <div className={data.title ? 'px-6 pb-6' : 'p-6'}>
        <div className={layoutClass}>
          {data.badges.map((badge) => (
            <span
              key={badge.id}
              className={`inline-flex items-center rounded-full font-medium ${sizeClass} ${variantClass(
                badge.variant || 'default'
              )}`}
            >
              {badge.icon && <span className="mr-1">{badge.icon}</span>}
              {badge.label}
              {badge.removable && (
                <button className="ml-1 hover:opacity-70">✕</button>
              )}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
