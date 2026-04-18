import type { KVCardData, KVField } from '@mcp-interactive-ui/types';

export interface KVCardBlockProps {
  data: KVCardData;
  className?: string;
}

const ALLOWED_HREF_SCHEMES = ['http:', 'https:', 'mailto:'];

function isSafeHref(href: string): boolean {
  try {
    const url = new URL(href);
    return ALLOWED_HREF_SCHEMES.includes(url.protocol);
  } catch {
    return false;
  }
}

function renderField(field: KVField): React.ReactNode {
  if (field.type === 'badge') {
    return (
      <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
        {field.value}
      </span>
    );
  }
  if (field.type === 'link' && field.href && isSafeHref(field.href)) {
    return (
      <a
        href={field.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-primary underline-offset-4 hover:underline"
      >
        {field.value}
      </a>
    );
  }
  return <span>{field.value}</span>;
}

export function KVCardBlock({ data, className }: KVCardBlockProps): JSX.Element {
  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="text-lg font-semibold leading-none tracking-tight">{data.title}</h3>
        {data.subtitle ? (
          <p className="text-sm text-muted-foreground">{data.subtitle}</p>
        ) : null}
      </div>
      <div className="p-6 pt-0">
        <dl className="grid grid-cols-[auto,1fr] gap-x-4 gap-y-2 text-sm">
          {data.fields.map((field, i) => (
            <div key={i} className="contents">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd>{renderField(field)}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  );
}
