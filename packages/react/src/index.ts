export { RenderAIContent, type RenderAIContentProps } from './RenderAIContent.js';
export { DataTableBlock, type DataTableBlockProps } from './blocks/DataTableBlock.js';
export { KVCardBlock, type KVCardBlockProps } from './blocks/KVCardBlock.js';
export { StatGroupBlock, type StatGroupBlockProps } from './blocks/StatGroupBlock.js';
export { NoticeBlock, type NoticeBlockProps } from './blocks/NoticeBlock.js';
export { MarkdownBlock, type MarkdownBlockProps } from './blocks/MarkdownBlock.js';
export { FormInputBlock, type FormInputBlockProps } from './blocks/FormInputBlock.js';
export { ButtonGroupBlock, type ButtonGroupBlockProps } from './blocks/ButtonGroupBlock.js';
export { TabsBlock, type TabsBlockProps } from './blocks/TabsBlock.js';
export { AccordionBlock, type AccordionBlockProps } from './blocks/AccordionBlock.js';
export { ModalBlock, type ModalBlockProps } from './blocks/ModalBlock.js';
export { ProgressBlock, type ProgressBlockProps } from './blocks/ProgressBlock.js';
export { ChartBlock, type ChartBlockProps } from './blocks/ChartBlock.js';
export { CodeBlock, type CodeBlockProps } from './blocks/CodeBlock.js';
export { TimelineBlock, type TimelineBlockProps } from './blocks/TimelineBlock.js';
export { GalleryBlock, type GalleryBlockProps } from './blocks/GalleryBlock.js';
export { ListBlock, type ListBlockProps } from './blocks/ListBlock.js';
export { BreadcrumbBlock, type BreadcrumbBlockProps } from './blocks/BreadcrumbBlock.js';
export { BadgeGroupBlock, type BadgeGroupBlockProps } from './blocks/BadgeGroupBlock.js';
export { MetricCardBlock, type MetricCardBlockProps } from './blocks/MetricCardBlock.js';
export { ComparisonTableBlock, type ComparisonTableBlockProps } from './blocks/ComparisonTableBlock.js';
export { JsonViewerBlock, type JsonViewerBlockProps } from './blocks/JsonViewerBlock.js';
export { DiffViewerBlock, type DiffViewerBlockProps } from './blocks/DiffViewerBlock.js';
export { KanbanBlock, type KanbanBlockProps } from './blocks/KanbanBlock.js';
export { TreeBlock, type TreeBlockProps } from './blocks/TreeBlock.js';
export { CarouselBlock, type CarouselBlockProps } from './blocks/CarouselBlock.js';
export { NestedBlockRenderer, type NestedBlockRendererProps } from './components/NestedBlockRenderer.js';
export {
  defaultBlockComponents,
  type BlockComponent,
  type BlockComponentMap,
  type BlockComponentProps,
} from './registry.js';
export type {
  BlockAction,
  BlockActionHandler,
  ValidateActionResult,
  TabItemWithContent,
  AccordionItemWithContent,
  ModalDataWithContent,
} from '@mcp-interactive-ui/types';

export type {
  NormalizedAIResponse,
  NormalizedBlock,
  BlockType,
} from '@mcp-interactive-ui/types';

// Theme System
export {
  ThemeProvider,
  useTheme,
  lightTheme,
  darkTheme,
  minimalTheme,
  highContrastTheme,
  colorblindTheme,
  brandTheme,
  presetThemes,
} from './theme/index.js';
export type { ThemeConfig, ThemeColors, ThemeProviderProps } from './theme/types.js';
