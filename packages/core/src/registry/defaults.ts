import type { BlockDefinition } from '@mcp-interactive-ui/types';
import { dataTableBlock } from './blocks/dataTable.js';
import { kvCardBlock } from './blocks/kvCard.js';
import { statGroupBlock } from './blocks/statGroup.js';
import { noticeBlock } from './blocks/notice.js';
import { markdownBlock } from './blocks/markdown.js';

/**
 * Built-in blocks shipped with Phase 1. Host apps may register additional
 * definitions via `registerBlock()` before calling `buildRegistry()`.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BUILTIN_BLOCKS: readonly BlockDefinition<any>[] = [
  dataTableBlock,
  kvCardBlock,
  statGroupBlock,
  noticeBlock,
  markdownBlock,
];
