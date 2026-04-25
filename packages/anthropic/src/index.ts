import Anthropic from '@anthropic-ai/sdk';
import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '@mcp-interactive-ui/core';
import { normalizeLLMResponse, buildSystemPrompt } from '@mcp-interactive-ui/core';

export interface AnthropicAdapterOptions {
  apiKey: string;
  model?: string;
  maxTokens?: number;
  temperature?: number;
}

/**
 * Convert registry to Anthropic tool definitions
 */
export function registryToAnthropicTools(registry: FrozenRegistry) {
  return registry.all().map((block) => ({
    name: block.id,
    description: block.description,
    input_schema: zodToJsonSchema(block.schema as z.ZodTypeAny, { target: 'openApi3' }),
  }));
}

/**
 * Send message with UI blocks support
 */
export async function sendMessageWithUI(
  client: Anthropic,
  message: string,
  registry: FrozenRegistry,
  options: AnthropicAdapterOptions
): Promise<NormalizedAIResponse> {
  const tools = registryToAnthropicTools(registry);

  const response = await client.messages.create({
    model: options.model || 'claude-3-opus-20240229',
    max_tokens: options.maxTokens || 4096,
    temperature: options.temperature ?? 0.7,
    system: buildSystemPrompt(registry),
    tools: tools as unknown as Array<unknown>,
    messages: [{ role: 'user', content: message }],
  } as unknown as Anthropic.Messages.MessageCreateParamsNonStreaming);

  // Extract tool use and text content
  const blocks: Array<{ type: string; id: string; data: unknown }> = [];
  let text = '';

  for (const content of response.content) {
    if (content.type === 'text') {
      text += content.text;
    } else if (content.type === 'tool_use') {
      const toolContent = content as unknown as { name: string; id: string; input: unknown };
      blocks.push({
        type: toolContent.name,
        id: toolContent.id,
        data: toolContent.input,
      });
    }
  }

  return normalizeLLMResponse({ text, blocks }, registry);
}

/**
 * Create Anthropic client with UI support
 */
export function createClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

export { registryToAnthropicTools as createAnthropicTools };
