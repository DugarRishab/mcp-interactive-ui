import { describe, it, expect, beforeEach } from 'vitest';
import { __resetRegistryForTests, getDefaultRegistry } from '@mcp-interactive-ui/core';
import {
  getAvailableUIBlocks,
  renderUIBlock,
  __resetToolsForTests,
} from '../tools.js';

describe('getAvailableUIBlocks', () => {
  beforeEach(() => {
    __resetRegistryForTests();
    __resetToolsForTests();
  });

  it('returns every block with a JSON schema and example', () => {
    const r = getDefaultRegistry();
    const { blocks } = getAvailableUIBlocks({}, r);
    expect(blocks).toHaveLength(5);
    for (const b of blocks) {
      expect(b.id).toBeTruthy();
      expect(b.schema).toBeTruthy();
      expect(b.example).toBeTruthy();
    }
  });

  it('filters by category', () => {
    const r = getDefaultRegistry();
    const { blocks } = getAvailableUIBlocks({ category: 'feedback' }, r);
    expect(blocks.map((b) => b.id)).toEqual(['notice']);
  });
});

describe('renderUIBlock', () => {
  beforeEach(() => {
    __resetRegistryForTests();
    __resetToolsForTests();
  });

  it('validates and returns a block', () => {
    const r = getDefaultRegistry();
    const res = renderUIBlock(
      { blockId: 'notice', data: { variant: 'info', message: 'hi' } },
      r,
    );
    expect(res.success).toBe(true);
    if (res.success) expect(res.block.type).toBe('notice');
  });

  it('returns a structured error for invalid data', () => {
    const r = getDefaultRegistry();
    const res = renderUIBlock(
      { blockId: 'notice', data: { variant: 'danger', message: 'x' } },
      r,
    );
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe('SCHEMA_INVALID');
  });

  it('returns an error for unknown block ids', () => {
    const r = getDefaultRegistry();
    const res = renderUIBlock({ blockId: 'nope', data: {} }, r);
    expect(res.success).toBe(false);
    if (!res.success) expect(res.error.code).toBe('UNKNOWN_BLOCK_TYPE');
  });
});
