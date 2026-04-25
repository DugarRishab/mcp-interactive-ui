import type { BlockType } from '@mcp-interactive-ui/types';
import type { Component } from 'vue';

// Import block components - Phase 1 (basic)
import DataTableBlock from './components/blocks/DataTableBlock.vue';
import KVCardBlock from './components/blocks/KVCardBlock.vue';
import StatGroupBlock from './components/blocks/StatGroupBlock.vue';
import NoticeBlock from './components/blocks/NoticeBlock.vue';
import MarkdownBlock from './components/blocks/MarkdownBlock.vue';

// Import block components - Phase 2 (interactive)
import FormInputBlock from './components/blocks/FormInputBlock.vue';
import ButtonGroupBlock from './components/blocks/ButtonGroupBlock.vue';
import TabsBlock from './components/blocks/TabsBlock.vue';
import AccordionBlock from './components/blocks/AccordionBlock.vue';
import ModalBlock from './components/blocks/ModalBlock.vue';
import ProgressBlock from './components/blocks/ProgressBlock.vue';

// Import block components - Phase 3 (read-only)
import ChartBlock from './components/blocks/ChartBlock.vue';
import CodeBlock from './components/blocks/CodeBlock.vue';
import TimelineBlock from './components/blocks/TimelineBlock.vue';
import GalleryBlock from './components/blocks/GalleryBlock.vue';
import ListBlock from './components/blocks/ListBlock.vue';
import BreadcrumbBlock from './components/blocks/BreadcrumbBlock.vue';
import BadgeGroupBlock from './components/blocks/BadgeGroupBlock.vue';
import MetricCardBlock from './components/blocks/MetricCardBlock.vue';
import ComparisonTableBlock from './components/blocks/ComparisonTableBlock.vue';
import JsonViewerBlock from './components/blocks/JsonViewerBlock.vue';
import DiffViewerBlock from './components/blocks/DiffViewerBlock.vue';
import KanbanBlock from './components/blocks/KanbanBlock.vue';
import TreeBlock from './components/blocks/TreeBlock.vue';
import CarouselBlock from './components/blocks/CarouselBlock.vue';

const defaultComponents: Record<BlockType, Component> = {
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
};

export function getDefaultBlockComponent(type: BlockType): Component | undefined {
  return defaultComponents[type];
}

export function getDefaultRegistry(): Record<BlockType, Component> {
  return { ...defaultComponents };
}
