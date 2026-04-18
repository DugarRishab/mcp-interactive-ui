import { z } from 'zod';

export const MAX_TABLE_ROWS = 500;
export const MAX_TABLE_COLUMNS = 20;
export const MAX_TABLE_CELL_CHARS = 200;

export const dataTableColumnTypeSchema = z.enum([
  'text',
  'number',
  'currency',
  'date',
  'badge',
]);

export const dataTableColumnSchema = z.object({
  key: z.string().min(1).max(64),
  header: z.string().min(1).max(120),
  type: dataTableColumnTypeSchema.optional(),
});

export const dataTableCellValueSchema = z.union([
  z.string().max(MAX_TABLE_CELL_CHARS),
  z.number(),
  z.boolean(),
  z.null(),
]);

export const dataTableRowSchema = z.record(z.string(), dataTableCellValueSchema);

export const dataTableDataSchema = z
  .object({
    columns: z.array(dataTableColumnSchema).min(1).max(MAX_TABLE_COLUMNS),
    rows: z.array(dataTableRowSchema).max(MAX_TABLE_ROWS),
    caption: z.string().max(240).optional(),
  })
  .strict();

export type DataTableColumnType = z.infer<typeof dataTableColumnTypeSchema>;
export type DataTableColumn = z.infer<typeof dataTableColumnSchema>;
export type DataTableRow = z.infer<typeof dataTableRowSchema>;
export type DataTableData = z.infer<typeof dataTableDataSchema>;
