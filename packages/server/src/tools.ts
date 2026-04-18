import { zodToJsonSchema } from 'zod-to-json-schema';
import { z } from 'zod';
import {
  validateBlock,
  type FrozenRegistry,
} from '@mcp-interactive-ui/core';

/**
 * LLM- and transport-agnostic tool handlers. The MCP server thin-wraps these
 * into protocol calls. Tests exercise them directly.
 */

export const GET_AVAILABLE_UI_BLOCKS = 'get_available_ui_blocks';
export const RENDER_UI_BLOCK = 'render_ui_block';

export const getAvailableUIBlocksInputSchema = z
  .object({
    category: z.enum(['data', 'feedback', 'layout', 'text']).optional(),
  })
  .strict();

export interface GetAvailableUIBlocksResult {
  blocks: Array<{
    id: string;
    name: string;
    description: string;
    category: string;
    schema: Record<string, unknown>;
    example: unknown;
  }>;
}

export function getAvailableUIBlocks(
  input: z.infer<typeof getAvailableUIBlocksInputSchema>,
  registry: FrozenRegistry,
): GetAvailableUIBlocksResult {
  const blocks = input.category
    ? registry.byCategory(input.category)
    : registry.all();

  return {
    blocks: blocks.map((b) => ({
      id: b.id,
      name: b.name,
      description: b.description,
      category: b.category,
      schema: zodToJsonSchema(b.schema, { target: 'openApi3' }) as Record<string, unknown>,
      example: b.example,
    })),
  };
}

export const renderUIBlockInputSchema = z
  .object({
    blockId: z.string().min(1),
    data: z.unknown(),
  })
  .strict();

export type RenderUIBlockResult =
  | { success: true; block: { type: string; id: string; data: unknown } }
  | { success: false; error: { code: string; message: string; issues?: unknown } };

let blockCounter = 0;

export function renderUIBlock(
  input: z.infer<typeof renderUIBlockInputSchema>,
  registry: FrozenRegistry,
): RenderUIBlockResult {
  blockCounter += 1;
  const id = `srv:${Date.now()}:${blockCounter}`;
  const res = validateBlock(input.blockId, input.data, id, registry);
  if (!res.ok) {
    return {
      success: false,
      error: {
        code: res.error.code,
        message: res.error.message,
        issues: res.error.issues,
      },
    };
  }
  return {
    success: true,
    block: { type: res.block.type, id: res.block.id, data: res.block.data },
  };
}

/** Reset internal counters. Tests only. */
export function __resetToolsForTests(): void {
  blockCounter = 0;
}
