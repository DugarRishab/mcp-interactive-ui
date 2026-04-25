import type { ListData } from '@mcp-interactive-ui/types';

export interface ListBlockProps {
  data: ListData;
  className?: string;
}

export function ListBlock({ data, className }: ListBlockProps): JSX.Element {
  const Tag = data.type === 'ordered' ? 'ol' : 'ul';
  const listClass = data.type === 'ordered' ? 'list-decimal' : data.type === 'checklist' ? 'list-none' : 'list-disc';

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {(data.title || data.description) && (
        <div className="p-6 pb-4">
          {data.title && <h3 className="text-lg font-semibold">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      <div className={data.title || data.description ? 'px-6 pb-6' : 'p-6'}>
        <Tag className={`${listClass} list-inside space-y-${data.dense ? '1' : '2'}`}>
          {data.items.map((item) => (
            <li
              key={item.id}
              className={`${
                data.hoverable ? 'hover:bg-muted/50 px-2 py-1 rounded transition-colors' : ''
              } ${data.separator && data.items.indexOf(item) < data.items.length - 1 ? 'pb-2 border-b' : ''}`}
            >
              <div className="flex items-start gap-2">
                {data.type === 'checklist' && (
                  <input
                    type="checkbox"
                    disabled
                    className="mt-1 h-4 w-4 rounded border-primary"
                  />
                )}
                <div className="flex-1">
                  <div className="font-medium">{item.label}</div>
                  {item.description && (
                    <div className="text-sm text-muted-foreground mt-1">{item.description}</div>
                  )}
                  {item.badge && (
                    <div className="mt-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                          item.badgeVariant === 'destructive'
                            ? 'bg-destructive text-destructive-foreground'
                            : item.badgeVariant === 'outline'
                              ? 'border border-input bg-background'
                              : 'bg-secondary text-secondary-foreground'
                        }`}
                      >
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </li>
          ))}
        </Tag>
      </div>
    </div>
  );
}
