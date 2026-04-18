import { describe, it, expect, beforeEach } from 'vitest';
import { __resetRegistryForTests, getDefaultRegistry, validateBlock } from '../../index.js';

describe('validateBlock', () => {
  beforeEach(() => __resetRegistryForTests());

  it('accepts valid data_table', () => {
    const r = getDefaultRegistry();
    const res = validateBlock(
      'data_table',
      { columns: [{ key: 'a', header: 'A' }], rows: [{ a: 1 }] },
      'id-1',
      r,
    );
    expect(res.ok).toBe(true);
  });

  it('rejects missing id', () => {
    const r = getDefaultRegistry();
    const res = validateBlock('data_table', {}, '', r);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('MISSING_ID');
  });

  it('rejects unknown block type', () => {
    const r = getDefaultRegistry();
    const res = validateBlock('nope', {}, 'id-1', r);
    expect(res.ok).toBe(false);
    if (!res.ok) expect(res.error.code).toBe('UNKNOWN_BLOCK_TYPE');
  });

  it('rejects invalid schema with issue paths', () => {
    const r = getDefaultRegistry();
    const res = validateBlock('notice', { variant: 'danger', message: 'x' }, 'id-1', r);
    expect(res.ok).toBe(false);
    if (!res.ok) {
      expect(res.error.code).toBe('SCHEMA_INVALID');
      expect(res.error.issues?.[0]?.path).toEqual(['variant']);
    }
  });
});
