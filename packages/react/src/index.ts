export { RenderAIContent, type RenderAIContentProps } from './RenderAIContent.js';
export { DataTableBlock, type DataTableBlockProps } from './blocks/DataTableBlock.js';
export { KVCardBlock, type KVCardBlockProps } from './blocks/KVCardBlock.js';
export { StatGroupBlock, type StatGroupBlockProps } from './blocks/StatGroupBlock.js';
export { NoticeBlock, type NoticeBlockProps } from './blocks/NoticeBlock.js';
export { MarkdownBlock, type MarkdownBlockProps } from './blocks/MarkdownBlock.js';
export {
  defaultBlockComponents,
  type BlockComponent,
  type BlockComponentMap,
  type BlockComponentProps,
} from './registry.js';

export type {
  NormalizedAIResponse,
  NormalizedBlock,
  BlockType,
} from '@mcp-interactive-ui/types';
