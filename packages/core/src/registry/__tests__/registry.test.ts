import { describe, it, expect, beforeEach } from 'vitest';
import {
  registerBlock,
  buildRegistry,
  __resetRegistryForTests,
  getDefaultRegistry,
  dataTableBlock,
  BUILTIN_BLOCKS,
} from '../../index.js';

describe('registry', () => {
  beforeEach(() => __resetRegistryForTests());

  it('exposes all built-in blocks by default', () => {
    const r = getDefaultRegistry();
    const types = r.all().map((b) => b.type).sort();
    expect(types).toEqual(['data_table', 'kv_card', 'markdown', 'notice', 'stat_group']);
  });

  it('buildRegistry is idempotent', () => {
    const a = buildRegistry();
    const b = buildRegistry();
    expect(a).toBe(b);
  });

  it('registerBlock throws after freeze', () => {
    buildRegistry();
    expect(() => registerBlock(dataTableBlock)).toThrow(/already been frozen/);
  });

  it('registerBlock rejects duplicate types', () => {
    registerBlock(dataTableBlock);
    expect(() => registerBlock(dataTableBlock)).toThrow(/already registered/);
  });

  it('rejects types outside the Phase 1 closed set', () => {
    registerBlock({
      ...dataTableBlock,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      id: 'custom_block' as any,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      type: 'custom_block' as any,
    });
    expect(() => buildRegistry()).toThrow(/closed set/);
  });

  it('byCategory filters correctly', () => {
    const r = buildRegistry();
    expect(r.byCategory('feedback').map((b) => b.type)).toEqual(['notice']);
    expect(r.byCategory('text').map((b) => b.type)).toEqual(['markdown']);
  });

  it('has() returns false for unknown types', () => {
    const r = buildRegistry();
    expect(r.has('nope')).toBe(false);
    expect(r.has('data_table')).toBe(true);
  });

  it('BUILTIN_BLOCKS length matches the closed set size', () => {
    expect(BUILTIN_BLOCKS).toHaveLength(5);
  });
});
