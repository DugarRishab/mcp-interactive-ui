import { z } from 'zod';
import type { NormalizedBlock } from '@mcp-interactive-ui/types';

/**
 * Generate random test data for a Zod schema
 */
export function generateFromSchema(schema: z.ZodType<unknown>): unknown {
  // Handle different schema types
  if (schema instanceof z.ZodString) {
    return 'test-string';
  }
  if (schema instanceof z.ZodNumber) {
    return 42;
  }
  if (schema instanceof z.ZodBoolean) {
    return true;
  }
  if (schema instanceof z.ZodArray) {
    return [generateFromSchema(schema.element)];
  }
  if (schema instanceof z.ZodObject) {
    const shape = schema.shape as Record<string, z.ZodType<unknown>>;
    const obj: Record<string, unknown> = {};
    for (const [key, valSchema] of Object.entries(shape)) {
      obj[key] = generateFromSchema(valSchema);
    }
    return obj;
  }
  if (schema instanceof z.ZodOptional) {
    return generateFromSchema(schema.unwrap());
  }
  if (schema instanceof z.ZodDefault) {
    return schema._def.defaultValue();
  }
  if (schema instanceof z.ZodEnum) {
    return schema.options[0];
  }
  if (schema instanceof z.ZodUnion) {
    return generateFromSchema(schema.options[0]);
  }

  return null;
}

/**
 * Generate test block data
 */
export function generateTestBlock(
  type: string,
  overrides: Partial<NormalizedBlock> = {}
): NormalizedBlock {
  return {
    type: type as NormalizedBlock['type'],
    id: `test-${type}-${Date.now()}`,
    data: {},
    ...overrides,
  } as NormalizedBlock;
}

/**
 * Generate multiple test blocks
 */
export function generateTestBlocks(
  types: string[],
  count: number = 1
): NormalizedBlock[] {
  const blocks = [];
  for (let i = 0; i < count; i++) {
    const type = types[i % types.length] as string;
    blocks.push(generateTestBlock(type, { id: `test-${type}-${i}` }));
  }
  return blocks as NormalizedBlock[];
}

/**
 * Generate edge case test data
 */
export function generateEdgeCases(): Record<string, unknown>[] {
  return [
    {}, // Empty object
    { id: null, type: null }, // Null values
    { id: '', type: '' }, // Empty strings
    { id: 'a'.repeat(1000), type: 'x' }, // Long strings
    { id: 'test', type: 'test', nested: { deep: { value: 'x' } } }, // Deep nesting
    { id: 'test', type: 'test', items: new Array(1000).fill('x') }, // Large arrays
  ];
}
