import { z } from 'zod';
import { dataTableDataSchema } from './dataTable.js';
import { kvCardDataSchema } from './kvCard.js';
import { statGroupDataSchema } from './statGroup.js';
import { noticeDataSchema } from './notice.js';
import { markdownDataSchema } from './markdown.js';
import { formInputDataSchema } from './formInput.js';
import { buttonGroupDataSchema } from './buttonGroup.js';
import { tabsDataSchema } from './tabs.js';
import { accordionDataSchema } from './accordion.js';
import { modalDataSchema } from './modal.js';
import { progressDataSchema } from './progress.js';
import { chartDataSchema } from './chart.js';
import { codeDataSchema } from './code.js';
import { timelineDataSchema } from './timeline.js';
import { galleryDataSchema } from './gallery.js';
import { listDataSchema } from './list.js';
import { breadcrumbDataSchema } from './breadcrumb.js';
import { badgeGroupDataSchema } from './badgeGroup.js';
import { metricCardDataSchema } from './metricCard.js';
import { comparisonTableDataSchema } from './comparisonTable.js';
import { jsonViewerDataSchema } from './jsonViewer.js';
import { diffViewerDataSchema } from './diffViewer.js';
import { kanbanDataSchema } from './kanban.js';
import { treeDataSchema } from './tree.js';
import { carouselDataSchema } from './carousel.js';

export * from './dataTable.js';
export * from './kvCard.js';
export * from './statGroup.js';
export * from './notice.js';
export * from './markdown.js';
export * from './formInput.js';
export * from './buttonGroup.js';
export * from './tabs.js';
export * from './accordion.js';
export * from './modal.js';
export * from './progress.js';
export * from './chart.js';
export * from './code.js';
export * from './timeline.js';
export * from './gallery.js';
export * from './list.js';
export * from './breadcrumb.js';
export * from './badgeGroup.js';
export * from './metricCard.js';
export * from './comparisonTable.js';
export * from './jsonViewer.js';
export * from './diffViewer.js';
export * from './kanban.js';
export * from './tree.js';
export * from './carousel.js';
export * from './interactive.js';

/**
 * The closed set of known block type identifiers.
 * Every rendered block MUST have one of these types.
 */
const knownBlockTypeSchema = z.enum([
  'data_table',
  'kv_card',
  'stat_group',
  'notice',
  'markdown',
  'form_input',
  'button_group',
  'tabs',
  'accordion',
  'modal',
  'progress',
  'chart',
  'code',
  'timeline',
  'gallery',
  'list',
  'breadcrumb',
  'badge_group',
  'metric_card',
  'comparison_table',
  'json_viewer',
  'diff_viewer',
  'kanban',
  'tree',
  'carousel',
]);

export { knownBlockTypeSchema };

/** The set of known block type identifiers — used for indexing BlockDataByType. */
export type KnownBlockType = z.infer<typeof knownBlockTypeSchema>;

/**
 * Block type identifier. Includes the closed set of known types plus any
 * custom string for third-party extensions registered via registerBlock().
 */
export const blockTypeSchema = knownBlockTypeSchema.or(z.string());

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
  z.object({ type: z.literal('form_input'), id: z.string().min(1), data: formInputDataSchema }),
  z.object({ type: z.literal('button_group'), id: z.string().min(1), data: buttonGroupDataSchema }),
  z.object({ type: z.literal('tabs'), id: z.string().min(1), data: tabsDataSchema }),
  z.object({ type: z.literal('accordion'), id: z.string().min(1), data: accordionDataSchema }),
  z.object({ type: z.literal('modal'), id: z.string().min(1), data: modalDataSchema }),
  z.object({ type: z.literal('progress'), id: z.string().min(1), data: progressDataSchema }),
  z.object({ type: z.literal('chart'), id: z.string().min(1), data: chartDataSchema }),
  z.object({ type: z.literal('code'), id: z.string().min(1), data: codeDataSchema }),
  z.object({ type: z.literal('timeline'), id: z.string().min(1), data: timelineDataSchema }),
  z.object({ type: z.literal('gallery'), id: z.string().min(1), data: galleryDataSchema }),
  z.object({ type: z.literal('list'), id: z.string().min(1), data: listDataSchema }),
  z.object({ type: z.literal('breadcrumb'), id: z.string().min(1), data: breadcrumbDataSchema }),
  z.object({ type: z.literal('badge_group'), id: z.string().min(1), data: badgeGroupDataSchema }),
  z.object({ type: z.literal('metric_card'), id: z.string().min(1), data: metricCardDataSchema }),
  z.object({ type: z.literal('comparison_table'), id: z.string().min(1), data: comparisonTableDataSchema }),
  z.object({ type: z.literal('json_viewer'), id: z.string().min(1), data: jsonViewerDataSchema }),
  z.object({ type: z.literal('diff_viewer'), id: z.string().min(1), data: diffViewerDataSchema }),
  z.object({ type: z.literal('kanban'), id: z.string().min(1), data: kanbanDataSchema }),
  z.object({ type: z.literal('tree'), id: z.string().min(1), data: treeDataSchema }),
  z.object({ type: z.literal('carousel'), id: z.string().min(1), data: carouselDataSchema }),
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
  form_input: z.infer<typeof formInputDataSchema>;
  button_group: z.infer<typeof buttonGroupDataSchema>;
  tabs: z.infer<typeof tabsDataSchema>;
  accordion: z.infer<typeof accordionDataSchema>;
  modal: z.infer<typeof modalDataSchema>;
  progress: z.infer<typeof progressDataSchema>;
  chart: z.infer<typeof chartDataSchema>;
  code: z.infer<typeof codeDataSchema>;
  timeline: z.infer<typeof timelineDataSchema>;
  gallery: z.infer<typeof galleryDataSchema>;
  list: z.infer<typeof listDataSchema>;
  breadcrumb: z.infer<typeof breadcrumbDataSchema>;
  badge_group: z.infer<typeof badgeGroupDataSchema>;
  metric_card: z.infer<typeof metricCardDataSchema>;
  comparison_table: z.infer<typeof comparisonTableDataSchema>;
  json_viewer: z.infer<typeof jsonViewerDataSchema>;
  diff_viewer: z.infer<typeof diffViewerDataSchema>;
  kanban: z.infer<typeof kanbanDataSchema>;
  tree: z.infer<typeof treeDataSchema>;
  carousel: z.infer<typeof carouselDataSchema>;
};

/** Lookup table of Zod schemas keyed by block type — used by core's validator. */
export const blockDataSchemaByType = {
  data_table: dataTableDataSchema,
  kv_card: kvCardDataSchema,
  stat_group: statGroupDataSchema,
  notice: noticeDataSchema,
  markdown: markdownDataSchema,
  form_input: formInputDataSchema,
  button_group: buttonGroupDataSchema,
  tabs: tabsDataSchema,
  accordion: accordionDataSchema,
  modal: modalDataSchema,
  progress: progressDataSchema,
  chart: chartDataSchema,
  code: codeDataSchema,
  timeline: timelineDataSchema,
  gallery: galleryDataSchema,
  list: listDataSchema,
  breadcrumb: breadcrumbDataSchema,
  badge_group: badgeGroupDataSchema,
  metric_card: metricCardDataSchema,
  comparison_table: comparisonTableDataSchema,
  json_viewer: jsonViewerDataSchema,
  diff_viewer: diffViewerDataSchema,
  kanban: kanbanDataSchema,
  tree: treeDataSchema,
  carousel: carouselDataSchema,
} as const;
