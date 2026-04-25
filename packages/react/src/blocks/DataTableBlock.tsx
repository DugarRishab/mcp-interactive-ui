import type { DataTableData, DataTableColumn } from '@mcp-interactive-ui/types';
import { formatCell, formatCurrency, formatDate } from '../utils/format.js';

export interface DataTableBlockProps {
  data: DataTableData;
  className?: string;
}

function renderCell(col: DataTableColumn, value: unknown): React.ReactNode {
  switch (col.type) {
    case 'currency':
      return formatCurrency(value);
    case 'date':
      return formatDate(value);
    case 'badge':
      return (
        <span className="inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium">
          {formatCell(value)}
        </span>
      );
    case 'number':
      return typeof value === 'number' ? value.toLocaleString() : formatCell(value);
    default:
      return formatCell(value);
  }
}

/**
 * Renders a `data_table` block. Uses plain Tailwind classes that align with the
 * default shadcn Table primitive; host apps may replace the component via the
 * `components` prop on <RenderAIContent />.
 */
export function DataTableBlock({ data, className }: DataTableBlockProps): JSX.Element {
  const tableId = `table-${Math.random().toString(36).substr(2, 9)}`;
  return (
    <div className={className ?? 'w-full overflow-x-auto rounded-md border'} role="region" aria-labelledby={`${tableId}-caption`}>
      <table className="w-full caption-bottom text-sm" aria-describedby={data.caption ? `${tableId}-caption` : undefined}>
        {data.caption ? (
          <caption id={`${tableId}-caption`} className="mt-2 text-xs text-muted-foreground">{data.caption}</caption>
        ) : null}
        <thead className="[&_tr]:border-b" role="rowgroup">
          <tr className="border-b transition-colors" role="row">
            {data.columns.map((col) => (
              <th
                key={col.key}
                scope="col"
                role="columnheader"
                className="h-10 px-3 text-left align-middle font-medium text-muted-foreground"
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="[&_tr:last-child]:border-0" role="rowgroup">
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex} role="row" className="border-b transition-colors hover:bg-muted/50">
              {data.columns.map((col) => (
                <td key={col.key} role="cell" className="p-3 align-middle">
                  {renderCell(col, row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
