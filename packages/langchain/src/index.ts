import { StructuredTool } from '@langchain/core/tools';
import { z } from 'zod';
import type { BaseChatModel } from '@langchain/core/language_models/chat_models';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '@mcp-interactive-ui/core';
import { normalizeLLMResponse } from '@mcp-interactive-ui/core';

export interface LangChainAdapterOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export const RENDER_TOOL_NAME = 'render_ui_block';

/**
 * Build the LangChain `tools` array describing `render_ui_block`.
 *
 * Strategy: one tool, with a `blockId` discriminator and a `data` object whose
 * JSON schema is the union of every registered block's schema. LLMs handle this
 * well and it keeps the tool surface minimal.
 */
export function registryToLangChainTools(registry: FrozenRegistry): StructuredTool[] {
  const blocks = [...registry.all()].sort((a, b) => a.id.localeCompare(b.id));

  const blockIdEnum = blocks.map((b) => b.id);

  const toolSchema = z.object({
    blockId: z.enum(blockIdEnum as [string, ...string[]]),
    data: z.record(z.unknown()),
  });

  class RenderUIBlockTool extends StructuredTool {
    name = RENDER_TOOL_NAME;
    description =
      'Render one structured UI block in the assistant response. Must be called once per block.';
    schema = toolSchema;

    constructor() {
      super();
    }

    async _call(_input: unknown): Promise<string> {
      // The tool call result is not used by the adapter — we only care about
      // what the LLM passed as arguments. Return an empty string.
      return '';
    }
  }

  return [new RenderUIBlockTool()];
}

/**
 * Parse tool calls from a LangChain AIMessage-like object.
 * Returns RawBlock array compatible with normalizeLLMResponse.
 */
interface LangChainToolCall {
  name: string;
  args: { blockId?: string; data?: unknown };
}

function parseLangChainToolCalls(
  response: unknown,
): Array<{ type: string; id: string; data: unknown }> {
  // LangChain's tool_calls are attached as an array on the response.
  // The exact shape depends on the model, but we handle the common case.
  const toolCalls = (response as { tool_calls?: LangChainToolCall[] }).tool_calls ?? [];

  return toolCalls
    .filter((call) => call.name === RENDER_TOOL_NAME)
    .map((call) => ({
      type: call.args.blockId ?? '',
      id: '', // LangChain doesn't provide a call id in this interface
      data: call.args.data,
    }))
    .filter((block) => block.type !== '');
}

/**
 * Build system prompt for LLM with block definitions
 */
export function buildSystemPrompt(registry: FrozenRegistry): string {
  const blocks = registry.all();

  return `You are an AI assistant that can respond with structured UI blocks.

Available block types:
${blocks.map((b: { id: string; description: string }) => `- ${b.id}: ${b.description}`).join('\n')}

Use these blocks to create rich, interactive responses. When calling a tool, provide valid data matching the schema.`;
}

/**
 * Invoke LLM with UI blocks support
 */
export async function invokeWithUI(
  llm: BaseChatModel,
  userMessage: string,
  registry: FrozenRegistry,
  options: LangChainAdapterOptions = {}
): Promise<NormalizedAIResponse> {
  const tools = registryToLangChainTools(registry);

  // Build the bind options - only include options that are explicitly set
  const bindOptions: Record<string, unknown> = {};
  if (options.model) bindOptions.model = options.model;
  if (options.temperature !== undefined) bindOptions.temperature = options.temperature;
  if (options.maxTokens !== undefined) bindOptions.maxTokens = options.maxTokens;

  const llmWithTools = llm.bindTools ? llm.bindTools(tools, bindOptions) : llm;

  const response = await llmWithTools.invoke([
    ['system', buildSystemPrompt(registry)],
    ['user', userMessage],
  ]);

  // Extract tool calls and text content
  const toolCalls = parseLangChainToolCalls(response);
  const content = typeof response.content === 'string' ? response.content : '';

  return normalizeLLMResponse({ text: content, blocks: toolCalls }, registry);
}

export { registryToLangChainTools as createLangChainTools };
