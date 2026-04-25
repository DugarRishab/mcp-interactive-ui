import type { BlockType } from '@mcp-interactive-ui/types';
import { DataTableBlock } from './blocks/DataTableBlock.js';
import { KVCardBlock } from './blocks/KVCardBlock.js';
import { StatGroupBlock } from './blocks/StatGroupBlock.js';
import { NoticeBlock } from './blocks/NoticeBlock.js';
import { MarkdownBlock } from './blocks/MarkdownBlock.js';
import { FormInputBlock } from './blocks/FormInputBlock.js';
import { ButtonGroupBlock } from './blocks/ButtonGroupBlock.js';
import { TabsBlock } from './blocks/TabsBlock.js';
import { AccordionBlock } from './blocks/AccordionBlock.js';
import { ModalBlock } from './blocks/ModalBlock.js';
import { ProgressBlock } from './blocks/ProgressBlock.js';
import { ChartBlock } from './blocks/ChartBlock.js';
import { CodeBlock } from './blocks/CodeBlock.js';
import { TimelineBlock } from './blocks/TimelineBlock.js';
import { GalleryBlock } from './blocks/GalleryBlock.js';
import { ListBlock } from './blocks/ListBlock.js';
import { BreadcrumbBlock } from './blocks/BreadcrumbBlock.js';
import { BadgeGroupBlock } from './blocks/BadgeGroupBlock.js';
import { MetricCardBlock } from './blocks/MetricCardBlock.js';
import { ComparisonTableBlock } from './blocks/ComparisonTableBlock.js';
import { JsonViewerBlock } from './blocks/JsonViewerBlock.js';
import { DiffViewerBlock } from './blocks/DiffViewerBlock.js';
import { KanbanBlock } from './blocks/KanbanBlock.js';
import { TreeBlock } from './blocks/TreeBlock.js';
import { CarouselBlock } from './blocks/CarouselBlock.js';

/** Props every block component receives from the renderer. */
export interface BlockComponentProps {
  data: unknown;
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

export type BlockComponent = React.ComponentType<BlockComponentProps>;

export type BlockComponentMap = {
  [K in BlockType]?: BlockComponent;
};

export const defaultBlockComponents: BlockComponentMap = {
  data_table: DataTableBlock,
  kv_card: KVCardBlock,
  stat_group: StatGroupBlock,
  notice: NoticeBlock,
  markdown: MarkdownBlock,
  form_input: FormInputBlock,
  button_group: ButtonGroupBlock,
  tabs: TabsBlock,
  accordion: AccordionBlock,
  modal: ModalBlock,
  progress: ProgressBlock,
  chart: ChartBlock,
  code: CodeBlock,
  timeline: TimelineBlock,
  gallery: GalleryBlock,
  list: ListBlock,
  breadcrumb: BreadcrumbBlock,
  badge_group: BadgeGroupBlock,
  metric_card: MetricCardBlock,
  comparison_table: ComparisonTableBlock,
  json_viewer: JsonViewerBlock,
  diff_viewer: DiffViewerBlock,
  kanban: KanbanBlock,
  tree: TreeBlock,
  carousel: CarouselBlock,
} as BlockComponentMap;
