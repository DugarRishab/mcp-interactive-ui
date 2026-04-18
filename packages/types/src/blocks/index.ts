import { z } from 'zod';
import { dataTableDataSchema } from './dataTable.js';
import { kvCardDataSchema } from './kvCard.js';
import { statGroupDataSchema } from './statGroup.js';
import { noticeDataSchema } from './notice.js';
import { markdownDataSchema } from './markdown.js';

export * from './dataTable.js';
export * from './kvCard.js';
export * from './statGroup.js';
export * from './notice.js';
export * from './markdown.js';

/**
 * The closed set of block type identifiers known to Phase 1.
 * Every rendered block MUST have one of these types.
 */
export const blockTypeSchema = z.enum([
  'data_table',
  'kv_card',
  'stat_group',
  'notice',
  'markdown',
]);

export type BlockType = z.infer<typeof blockTypeSchema>;

/**
 * Discriminated union of every normalized block. The server returns values of this
 * shape; the React renderer dispatches on `type`.
 */
export const normalizedBlockSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('data_table'), id: z.string().min(1), data: dataTableDataSchema }),
  z.object({ type: z.literal('kv_card'), id: z.string().min(1), data: kvCardDataSchema }),
  z.object({ type: z.literal('stat_group'), id: z.string().min(1), data: statGroupDataSchema }),
  z.object({ type: z.literal('notice'), id: z.string().min(1), data: noticeDataSchema }),
  z.object({ type: z.literal('markdown'), id: z.string().min(1), data: markdownDataSchema }),
]);

export type NormalizedBlock = z.infer<typeof normalizedBlockSchema>;

/**
 * Map from block type string to its corresponding `data` payload type.
 * Used by generic code that needs to accept a `(type, data)` pair.
 */
export type BlockDataByType = {
  data_table: z.infer<typeof dataTableDataSchema>;
  kv_card: z.infer<typeof kvCardDataSchema>;
  stat_group: z.infer<typeof statGroupDataSchema>;
  notice: z.infer<typeof noticeDataSchema>;
  markdown: z.infer<typeof markdownDataSchema>;
};

/** Lookup table of Zod schemas keyed by block type — used by core's validator. */
export const blockDataSchemaByType = {
  data_table: dataTableDataSchema,
  kv_card: kvCardDataSchema,
  stat_group: statGroupDataSchema,
  notice: noticeDataSchema,
  markdown: markdownDataSchema,
} as const;
