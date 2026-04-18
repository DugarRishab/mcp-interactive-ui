import type { BlockType, NormalizedBlock } from '@mcp-interactive-ui/types';
import { DataTableBlock } from './blocks/DataTableBlock.js';
import { KVCardBlock } from './blocks/KVCardBlock.js';
import { StatGroupBlock } from './blocks/StatGroupBlock.js';
import { NoticeBlock } from './blocks/NoticeBlock.js';
import { MarkdownBlock } from './blocks/MarkdownBlock.js';

/** Props every block component receives from the renderer. */
export interface BlockComponentProps<T extends BlockType = BlockType> {
  data: Extract<NormalizedBlock, { type: T }>['data'];
  className?: string;
}

export type BlockComponent<T extends BlockType = BlockType> = React.ComponentType<
  BlockComponentProps<T>
>;

export type BlockComponentMap = {
  [K in BlockType]: BlockComponent<K>;
};

export const defaultBlockComponents: BlockComponentMap = {
  data_table: DataTableBlock,
  kv_card: KVCardBlock,
  stat_group: StatGroupBlock,
  notice: NoticeBlock,
  markdown: MarkdownBlock,
};
