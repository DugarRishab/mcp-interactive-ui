import type {
  NormalizedAIResponse,
  NormalizedBlock,
  ResponseMetadata,
} from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '../registry/registry.js';
import { validateBlock } from './validateBlock.js';

/** Shape accepted from the LLM / adapter layer before normalization. */
export interface RawBlock {
  type: string;
  data: unknown;
  id?: string;
}

export interface RawAIResponse {
  text?: string;
  blocks?: RawBlock[];
  metadata?: ResponseMetadata;
  /**
   * Stable identifier for the assistant message, used as a prefix for block ids.
   * Recommended: OpenAI completion id, or a ULID generated server-side.
   */
  messageId?: string;
}

export interface NormalizeTelemetry {
  onNormalize?: (evt: {
    total: number;
    accepted: number;
    replaced: number;
    reasons: Record<string, number>;
  }) => void;
  onValidationError?: (evt: {
    blockType: string;
    code: string;
    path: (string | number)[];
    message: string;
  }) => void;
}

export interface NormalizeOptions {
  telemetry?: NormalizeTelemetry;
}

function makeFallbackNotice(
  id: string,
  title: string,
  message: string,
): NormalizedBlock {
  return {
    type: 'notice',
    id,
    data: {
      variant: 'warning',
      title,
      // Trim to the notice schema max to never fail our own validation.
      message: message.slice(0, 2000),
    },
  };
}

/**
 * Turn whatever the LLM produced into a safe, validated `NormalizedAIResponse`.
 *
 * Guarantees:
 *  - Never throws (invalid input becomes a `notice` fallback block).
 *  - Every block in the output conforms to `normalizedBlockSchema`.
 *  - Block ids are deterministic: `${messageId}:${index}` (or `block:${index}` if no messageId).
 */
export function normalizeLLMResponse(
  raw: RawAIResponse,
  registry: FrozenRegistry,
  options: NormalizeOptions = {},
): NormalizedAIResponse {
  const telemetry = options.telemetry;
  const reasons: Record<string, number> = {};
  const bump = (code: string): void => {
    reasons[code] = (reasons[code] ?? 0) + 1;
  };

  const safe: RawAIResponse =
    raw && typeof raw === 'object' ? raw : { blocks: [] };
  const prefix = safe.messageId ? String(safe.messageId) : 'block';
  const rawBlocks = Array.isArray(safe.blocks) ? safe.blocks : [];
  const out: NormalizedBlock[] = [];
  let accepted = 0;
  let replaced = 0;

  for (let i = 0; i < rawBlocks.length; i += 1) {
    const rb = rawBlocks[i] ?? { type: '', data: undefined };
    const id = rb.id && typeof rb.id === 'string' ? rb.id : `${prefix}:${i}`;
    const result = validateBlock(rb.type, rb.data, id, registry);

    if (result.ok) {
      out.push(result.block);
      accepted += 1;
      continue;
    }

    const { error } = result;
    bump(error.code);

    if (error.code === 'UNKNOWN_BLOCK_TYPE') {
      out.push(
        makeFallbackNotice(
          id,
          'Unsupported block',
          `The model requested an unknown block type "${rb.type}". It was replaced with this notice.`,
        ),
      );
      telemetry?.onValidationError?.({
        blockType: rb.type,
        code: error.code,
        path: [],
        message: error.message,
      });
    } else if (error.code === 'SCHEMA_INVALID') {
      const firstIssue = error.issues?.[0];
      out.push(
        makeFallbackNotice(
          id,
          'Invalid block data',
          `Block "${rb.type}" was rejected: ${firstIssue?.message ?? error.message}`,
        ),
      );
      for (const issue of error.issues ?? []) {
        telemetry?.onValidationError?.({
          blockType: rb.type,
          code: error.code,
          path: issue.path,
          message: issue.message,
        });
      }
    } else {
      // MISSING_ID or any future code — same safe fallback.
      out.push(makeFallbackNotice(id, 'Invalid block', error.message));
      telemetry?.onValidationError?.({
        blockType: rb.type,
        code: error.code,
        path: [],
        message: error.message,
      });
    }

    replaced += 1;
  }

  telemetry?.onNormalize?.({
    total: rawBlocks.length,
    accepted,
    replaced,
    reasons,
  });

  const response: NormalizedAIResponse = {
    blocks: out,
  };
  if (typeof safe.text === 'string' && safe.text.length > 0) response.text = safe.text;
  if (safe.metadata) response.metadata = safe.metadata;
  return response;
}
