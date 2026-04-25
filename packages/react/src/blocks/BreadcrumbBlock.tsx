import type { BreadcrumbData } from '@mcp-interactive-ui/types';

export interface BreadcrumbBlockProps {
  data: BreadcrumbData;
  className?: string;
}

export function BreadcrumbBlock({ data, className }: BreadcrumbBlockProps): JSX.Element {
  return (
    <nav className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      <ol className="flex flex-wrap items-center gap-2 p-4">
        {data.items.map((item, idx) => (
          <li key={idx} className="flex items-center gap-2">
            {item.href ? (
              <a
                href={item.href}
                className="text-primary hover:underline flex items-center gap-1"
              >
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </a>
            ) : (
              <span className={`flex items-center gap-1 ${item.disabled ? 'opacity-50 cursor-not-allowed' : ''}`}>
                {item.icon && <span>{item.icon}</span>}
                {item.label}
              </span>
            )}

            {idx < data.items.length - 1 && (
              <span className="text-muted-foreground">{data.separator}</span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
