import { z } from 'zod';
import { zodToJsonSchema } from 'zod-to-json-schema';
import type { FrozenRegistry } from '../registry/registry.js';
import type { RawBlock } from '../validation/normalize.js';

/**
 * Minimal shape of an OpenAI Chat Completions `tool` entry. We intentionally
 * do NOT depend on the `openai` npm package — we speak the wire format.
 */
export interface OpenAIChatTool {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, unknown>;
  };
}

/** Shape of a tool_call on an assistant message. */
export interface OpenAIToolCall {
  id: string;
  type: 'function';
  function: { name: string; arguments: string };
}

/** Shape of the assistant message we parse. */
export interface OpenAIAssistantMessage {
  role: 'assistant';
  content?: string | null;
  tool_calls?: OpenAIToolCall[] | null;
}

export const RENDER_TOOL_NAME = 'render_ui_block';

/**
 * Build the OpenAI `tools` array describing `render_ui_block`.
 *
 * Strategy: one tool, with a `blockId` discriminator and a `data` object whose
 * JSON schema is the union of every registered block's schema. LLMs handle this
 * well and it keeps the tool surface minimal.
 */
export function registryToOpenAITools(registry: FrozenRegistry): OpenAIChatTool[] {
  const blocks = [...registry.all()].sort((a, b) => a.id.localeCompare(b.id));

  const blockIdEnum = blocks.map((b) => b.id);

  // Each block gets its own branch keyed by blockId. We use `oneOf` so the model
  // is forced to match exactly one branch.
  const oneOf = blocks.map((b) => ({
    type: 'object',
    properties: {
      blockId: { const: b.id },
      data: zodToJsonSchema(b.schema as z.ZodTypeAny, { target: 'openApi3' }),
    },
    required: ['blockId', 'data'],
    additionalProperties: false,
  }));

  return [
    {
      type: 'function',
      function: {
        name: RENDER_TOOL_NAME,
        description:
          'Render one structured UI block in the assistant response. Must be called once per block.',
        parameters: {
          type: 'object',
          properties: {
            blockId: { type: 'string', enum: blockIdEnum },
            data: { type: 'object' },
          },
          required: ['blockId', 'data'],
          additionalProperties: false,
          oneOf,
        },
      },
    },
  ];
}

export interface ParseToolCallsOptions {
  /**
   * When a tool_call's JSON arguments can't be parsed, should we silently drop
   * the call (default) or include a synthetic block with type = '__invalid__'
   * so the normalizer surfaces it as a notice?
   */
  onParseError?: 'drop' | 'surface';
}

/**
 * Extract `RawBlock[]` from an OpenAI assistant message. Safe: never throws.
 * Tool calls whose name != `render_ui_block` are ignored.
 */
export function parseOpenAIToolCalls(
  message: OpenAIAssistantMessage,
  options: ParseToolCallsOptions = {},
): RawBlock[] {
  const mode = options.onParseError ?? 'drop';
  const out: RawBlock[] = [];
  const calls = message.tool_calls ?? [];

  for (const call of calls) {
    if (call.type !== 'function' || call.function.name !== RENDER_TOOL_NAME) continue;

    let parsed: unknown;
    try {
      parsed = JSON.parse(call.function.arguments);
    } catch {
      if (mode === 'surface') {
        out.push({ type: '__invalid__', data: { reason: 'tool_call_json_parse_error' } });
      }
      continue;
    }

    if (!parsed || typeof parsed !== 'object') continue;
    const p = parsed as { blockId?: unknown; data?: unknown };
    if (typeof p.blockId !== 'string') continue;
    out.push({ type: p.blockId, data: p.data, id: call.id });
  }

  return out;
}
