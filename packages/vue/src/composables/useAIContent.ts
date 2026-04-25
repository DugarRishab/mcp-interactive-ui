import { ref, computed, provide, inject, type InjectionKey } from 'vue';
import type { NormalizedAIResponse, NormalizedBlock, BlockAction } from '@mcp-interactive-ui/types';

export interface AIContentContext {
  response: ReturnType<typeof ref<NormalizedAIResponse | null>>;
  blocks: ReturnType<typeof computed<NormalizedBlock[]>>;
  setResponse: (data: NormalizedAIResponse) => void;
  handleAction: (action: BlockAction) => void;
}

const AIContentKey: InjectionKey<AIContentContext> = Symbol('AIContent');

export interface UseAIContentOptions {
  onBlockAction?: (action: BlockAction) => void;
}

export function useAIContentProvider(options: UseAIContentOptions = {}) {
  const response = ref<NormalizedAIResponse | null>(null);
  const blocks = computed(() => response.value?.blocks || []);

  const setResponse = (data: NormalizedAIResponse) => {
    response.value = data;
  };

  const handleAction = (action: BlockAction) => {
    options.onBlockAction?.(action);
  };

  const context: AIContentContext = {
    response,
    blocks,
    setResponse,
    handleAction,
  };

  provide(AIContentKey, context);

  return context;
}

export function useAIContent(): AIContentContext {
  const context = inject(AIContentKey);
  if (!context) {
    throw new Error('useAIContent must be used within an AIContentProvider');
  }
  return context;
}
