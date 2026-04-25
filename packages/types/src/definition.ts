import type { z } from 'zod';
import type { BlockType, KnownBlockType, BlockDataByType } from './blocks/index.js';

/**
 * Metadata describing a registered block. The same definition is consumed by:
 *  - the OpenAI tool-call adapter (to generate a function schema),
 *  - the MCP server (to expose `get_available_ui_blocks`),
 *  - the React renderer (to look up the component to render),
 *  - `buildSystemPrompt` (to describe the block to the LLM).
 */
export interface BlockDefinition<T extends BlockType = BlockType> {
  /** Stable, unique id. Same value as `type` for Phase 1 built-ins. */
  id: T;
  /** Discriminator used in NormalizedBlock. */
  type: T;
  /** Human-readable name, shown in docs / tool descriptions. */
  name: string;
  /** One-sentence description. Included verbatim in the LLM system prompt. */
  description: string;
  /** Coarse grouping for filtering / discovery. */
  category: 'data' | 'feedback' | 'layout' | 'text' | 'interactive';
  /** Runtime Zod schema for the block's `data` payload. */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: z.ZodType<any>;
  /** A minimal, valid example — used in prompts and docs. */
  example: T extends KnownBlockType ? BlockDataByType[T] : unknown;
}
