// Composables
export { useAIContent, useAIContentProvider, type UseAIContentOptions } from './composables/useAIContent';
export { useBlockRegistry, useBlockRegistryProvider, type BlockRegistry } from './composables/useBlockRegistry';
export { useTheme, useThemeProvider, type ThemeConfig, type ThemeColors, defaultTheme } from './composables/useTheme';

// Components
export { default as RenderAIContent } from './components/RenderAIContent.vue';
export { default as AIBlock } from './components/AIBlock.vue';

// Block Components
export { default as DataTableBlock } from './components/blocks/DataTableBlock.vue';
export { default as KVCardBlock } from './components/blocks/KVCardBlock.vue';
export { default as StatGroupBlock } from './components/blocks/StatGroupBlock.vue';
export { default as NoticeBlock } from './components/blocks/NoticeBlock.vue';
export { default as MarkdownBlock } from './components/blocks/MarkdownBlock.vue';
export { default as FormInputBlock } from './components/blocks/FormInputBlock.vue';
export { default as ButtonGroupBlock } from './components/blocks/ButtonGroupBlock.vue';
export { default as TabsBlock } from './components/blocks/TabsBlock.vue';
export { default as AccordionBlock } from './components/blocks/AccordionBlock.vue';
export { default as ModalBlock } from './components/blocks/ModalBlock.vue';
export { default as ProgressBlock } from './components/blocks/ProgressBlock.vue';
export { default as ChartBlock } from './components/blocks/ChartBlock.vue';
export { default as CodeBlock } from './components/blocks/CodeBlock.vue';
export { default as TimelineBlock } from './components/blocks/TimelineBlock.vue';
export { default as GalleryBlock } from './components/blocks/GalleryBlock.vue';
export { default as ListBlock } from './components/blocks/ListBlock.vue';
export { default as BreadcrumbBlock } from './components/blocks/BreadcrumbBlock.vue';
export { default as BadgeGroupBlock } from './components/blocks/BadgeGroupBlock.vue';
export { default as MetricCardBlock } from './components/blocks/MetricCardBlock.vue';
export { default as ComparisonTableBlock } from './components/blocks/ComparisonTableBlock.vue';
export { default as JsonViewerBlock } from './components/blocks/JsonViewerBlock.vue';
export { default as DiffViewerBlock } from './components/blocks/DiffViewerBlock.vue';
export { default as KanbanBlock } from './components/blocks/KanbanBlock.vue';
export { default as TreeBlock } from './components/blocks/TreeBlock.vue';
export { default as CarouselBlock } from './components/blocks/CarouselBlock.vue';

// Registry
export { getDefaultBlockComponent, getDefaultRegistry } from './registry';

// Re-export types from types package
export type {
  BlockType,
  NormalizedBlock,
  NormalizedAIResponse,
  BlockAction,
} from '@mcp-interactive-ui/types';
