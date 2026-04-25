import type { BlockDefinition } from '@mcp-interactive-ui/types';
import { dataTableBlock } from './blocks/dataTable.js';
import { kvCardBlock } from './blocks/kvCard.js';
import { statGroupBlock } from './blocks/statGroup.js';
import { noticeBlock } from './blocks/notice.js';
import { markdownBlock } from './blocks/markdown.js';
import { formInputBlock } from './blocks/formInput.js';
import { buttonGroupBlock } from './blocks/buttonGroup.js';
import { tabsBlock } from './blocks/tabs.js';
import { accordionBlock } from './blocks/accordion.js';
import { modalBlock } from './blocks/modal.js';
import { progressBlock } from './blocks/progress.js';
import { chartBlock } from './blocks/chart.js';
import { codeBlock } from './blocks/code.js';
import { timelineBlock } from './blocks/timeline.js';
import { galleryBlock } from './blocks/gallery.js';
import { listBlock } from './blocks/list.js';
import { breadcrumbBlock } from './blocks/breadcrumb.js';
import { badgeGroupBlock } from './blocks/badgeGroup.js';
import { metricCardBlock } from './blocks/metricCard.js';
import { comparisonTableBlock } from './blocks/comparisonTable.js';
import { jsonViewerBlock } from './blocks/jsonViewer.js';
import { diffViewerBlock } from './blocks/diffViewer.js';
import { kanbanBlock } from './blocks/kanban.js';
import { treeBlock } from './blocks/tree.js';
import { carouselBlock } from './blocks/carousel.js';

/**
 * Built-in blocks shipped with the library. Host apps may register additional
 * definitions via `registerBlock()` before calling `buildRegistry()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BUILTIN_BLOCKS: readonly BlockDefinition<any>[] = [
  // Interactive blocks
  formInputBlock,
  buttonGroupBlock,
  tabsBlock,
  accordionBlock,
  modalBlock,
  progressBlock,
  // Data display blocks
  dataTableBlock,
  statGroupBlock,
  metricCardBlock,
  chartBlock,
  comparisonTableBlock,
  // Content blocks
  markdownBlock,
  codeBlock,
  listBlock,
  galleryBlock,
  timelineBlock,
  // Navigation blocks
  breadcrumbBlock,
  treeBlock,
  carouselBlock,
  // Advanced blocks
  kvCardBlock,
  badgeGroupBlock,
  jsonViewerBlock,
  diffViewerBlock,
  kanbanBlock,
  noticeBlock,
];
