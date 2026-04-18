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

// Validation / normalization
export { validateBlock, type ValidateBlockResult, type ValidationIssue } from './validation/validateBlock.js';
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

// Re-export type-level shapes so consumers only need one dep.
export type {
  BlockType,
  BlockDefinition,
  NormalizedAIResponse,
  NormalizedBlock,
} from '@mcp-interactive-ui/types';
