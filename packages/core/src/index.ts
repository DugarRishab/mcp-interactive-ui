// Registry
export {
  registerBlock,
  buildRegistry,
  getDefaultRegistry,
  __resetRegistryForTests,
  type FrozenRegistry,
} from './registry/registry.js';
export { BUILTIN_BLOCKS } from './registry/defaults.js';
export { dataTableBlock } from './registry/blocks/dataTable.js';
export { kvCardBlock } from './registry/blocks/kvCard.js';
export { statGroupBlock } from './registry/blocks/statGroup.js';
export { noticeBlock } from './registry/blocks/notice.js';
export { markdownBlock } from './registry/blocks/markdown.js';
export { formInputBlock } from './registry/blocks/formInput.js';
export { buttonGroupBlock } from './registry/blocks/buttonGroup.js';
export { tabsBlock } from './registry/blocks/tabs.js';
export { accordionBlock } from './registry/blocks/accordion.js';
export { modalBlock } from './registry/blocks/modal.js';
export { progressBlock } from './registry/blocks/progress.js';
export { chartBlock } from './registry/blocks/chart.js';
export { codeBlock } from './registry/blocks/code.js';
export { timelineBlock } from './registry/blocks/timeline.js';
export { galleryBlock } from './registry/blocks/gallery.js';
export { listBlock } from './registry/blocks/list.js';
export { breadcrumbBlock } from './registry/blocks/breadcrumb.js';
export { badgeGroupBlock } from './registry/blocks/badgeGroup.js';
export { metricCardBlock } from './registry/blocks/metricCard.js';
export { comparisonTableBlock } from './registry/blocks/comparisonTable.js';
export { jsonViewerBlock } from './registry/blocks/jsonViewer.js';
export { diffViewerBlock } from './registry/blocks/diffViewer.js';
export { kanbanBlock } from './registry/blocks/kanban.js';
export { treeBlock } from './registry/blocks/tree.js';
export { carouselBlock } from './registry/blocks/carousel.js';

// Validation / normalization
export { validateBlock, type ValidateBlockResult, type ValidationIssue } from './validation/validateBlock.js';
export { validateAction, isValidAction, type ValidateActionOptions } from './validation/validateAction.js';
export {
  normalizeLLMResponse,
  type RawBlock,
  type RawAIResponse,
  type NormalizeOptions,
  type NormalizeTelemetry,
} from './validation/normalize.js';

// Prompt
export { buildSystemPrompt } from './prompt/buildSystemPrompt.js';

// OpenAI adapter
export {
  registryToOpenAITools,
  parseOpenAIToolCalls,
  RENDER_TOOL_NAME,
  type OpenAIChatTool,
  type OpenAIToolCall,
  type OpenAIAssistantMessage,
  type ParseToolCallsOptions,
} from './adapters/openai.js';

// Testing utilities
export * from './testing/index.js';

// Re-export type-level shapes so consumers only need one dep.
export type {
  BlockType,
  BlockDefinition,
  NormalizedAIResponse,
  NormalizedBlock,
} from '@mcp-interactive-ui/types';
