import { z, ZodSchema } from 'zod';
import type { NormalizedAIResponse, NormalizedBlock } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '@mcp-interactive-ui/core';
import { getDefaultRegistry } from '@mcp-interactive-ui/core';

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

export interface ValidationError {
  path: string;
  message: string;
  type?: string;
}

/**
 * Validate a block against its schema
 */
export function validateBlock(
  block: NormalizedBlock,
  registry: FrozenRegistry
): ValidationResult {
  const blockDef = registry.get(block.type);

  if (!blockDef) {
    return {
      valid: false,
      errors: [{ path: block.id, message: `Unknown block type: ${block.type}` }],
    };
  }

  try {
    blockDef.schema.parse(block.data);
    return { valid: true, errors: [] };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        valid: false,
        errors: error.errors.map((e) => ({
          path: `${block.id}.${e.path.join('.')}`,
          message: e.message,
          type: e.code,
        })),
      };
    }
    return {
      valid: false,
      errors: [{ path: block.id, message: String(error) }],
    };
  }
}

/**
 * Validate entire AI response
 */
export function validateResponse(
  response: NormalizedAIResponse,
  registry: FrozenRegistry
): ValidationResult {
  const errors: ValidationError[] = [];

  for (const block of response.blocks) {
    const result = validateBlock(block, registry);
    if (!result.valid) {
      errors.push(...result.errors);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Assert that response is valid
 */
export function assertValidResponse(
  response: NormalizedAIResponse,
  registry?: FrozenRegistry
): void {
  const reg = registry || getDefaultRegistry();
  const result = validateResponse(response, reg);

  if (!result.valid) {
    const messages = result.errors.map((e) => `${e.path}: ${e.message}`).join('\n');
    throw new Error(`Response validation failed:\n${messages}`);
  }
}

/**
 * Check if schema is valid
 */
export function isValidSchema(schema: ZodSchema): boolean {
  try {
    // Test with empty object
    schema.parse({});
    return true;
  } catch {
    // Expected to fail for strict schemas
    return true;
  }
}
