import type { ComparisonTableData } from '@mcp-interactive-ui/types';

export interface ComparisonTableBlockProps {
  data: ComparisonTableData;
  className?: string;
}

export function ComparisonTableBlock({ data, className }: ComparisonTableBlockProps): JSX.Element {
  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden'}>
      {(data.title || data.description) && (
        <div className="p-6 pb-4">
          {data.title && <h3 className="text-lg font-semibold">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className={data.striped ? 'bg-muted' : 'border-b'}>
              <th className="px-4 py-3 text-left font-semibold">Feature</th>
              {data.columns.map((col, idx) => (
                <th
                  key={idx}
                  className={`px-4 py-3 text-left font-semibold ${
                    data.highlightColumn === idx ? 'bg-primary/10' : ''
                  }`}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.rows.map((row, rowIdx) => (
              <tr
                key={rowIdx}
                className={`border-b last:border-b-0 ${
                  data.striped && rowIdx % 2 === 0 ? 'bg-muted/50' : ''
                }`}
              >
                <td className="px-4 py-3 font-medium">{row.label}</td>
                {row.items.map((item, colIdx) => (
                  <td
                    key={colIdx}
                    className={`px-4 py-3 ${
                      data.highlightColumn === colIdx ? 'bg-primary/10' : ''
                    }`}
                  >
                    {typeof item === 'boolean' ? (
                      <span className={item ? 'text-green-600' : 'text-red-600'}>
                        {item ? '✓' : '✗'}
                      </span>
                    ) : (
                      item
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
