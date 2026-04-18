import type { ZodError } from 'zod';
import type { BlockType, NormalizedBlock } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '../registry/registry.js';

export interface ValidationIssue {
  path: (string | number)[];
  message: string;
  code: string;
}

export type ValidateBlockResult =
  | { ok: true; block: NormalizedBlock }
  | {
      ok: false;
      error: {
        code:
          | 'UNKNOWN_BLOCK_TYPE'
          | 'SCHEMA_INVALID'
          | 'MISSING_ID';
        message: string;
        issues?: ValidationIssue[];
      };
    };

function zodToIssues(err: ZodError): ValidationIssue[] {
  return err.errors.map((e) => ({
    path: e.path,
    message: e.message,
    code: e.code,
  }));
}

/**
 * Validate a (type, data) pair against the registry. Returns a fully-typed
 * `NormalizedBlock` on success, or a structured error on failure.
 *
 * Does NOT throw.
 */
export function validateBlock(
  type: string,
  data: unknown,
  id: string,
  registry: FrozenRegistry,
): ValidateBlockResult {
  if (!id || typeof id !== 'string') {
    return {
      ok: false,
      error: { code: 'MISSING_ID', message: 'Block id must be a non-empty string.' },
    };
  }

  if (!registry.has(type)) {
    return {
      ok: false,
      error: {
        code: 'UNKNOWN_BLOCK_TYPE',
        message: `Unknown block type "${type}". Known types: ${registry
          .all()
          .map((b) => b.type)
          .join(', ')}.`,
      },
    };
  }

  const def = registry.get(type as BlockType)!;
  const parsed = def.schema.safeParse(data);
  if (!parsed.success) {
    return {
      ok: false,
      error: {
        code: 'SCHEMA_INVALID',
        message: `Block "${type}" failed schema validation.`,
        issues: zodToIssues(parsed.error),
      },
    };
  }

  // The discriminated NormalizedBlock union is constrained by the registry; the
  // cast is safe because `def.schema` is typed by `BlockType`.
  return {
    ok: true,
    block: { type: def.type, id, data: parsed.data } as NormalizedBlock,
  };
}
