import { describe, it, expect } from 'vitest';
import {
  dataTableDataSchema,
  kvCardDataSchema,
  statGroupDataSchema,
  noticeDataSchema,
  markdownDataSchema,
  normalizedBlockSchema,
  blockTypeSchema,
  MAX_TABLE_ROWS,
  MAX_MARKDOWN_CHARS,
} from '../index.js';
import { normalizedAIResponseSchema } from '../../response.js';

describe('dataTableDataSchema', () => {
  it('accepts a minimal valid table', () => {
    const parsed = dataTableDataSchema.parse({
      columns: [{ key: 'name', header: 'Name' }],
      rows: [{ name: 'Ada' }],
    });
    expect(parsed.rows).toHaveLength(1);
  });

  it('rejects empty columns', () => {
    expect(() => dataTableDataSchema.parse({ columns: [], rows: [] })).toThrow();
  });

  it('rejects unknown keys (strict)', () => {
    expect(() =>
      dataTableDataSchema.parse({
        columns: [{ key: 'a', header: 'A' }],
        rows: [],
        sortable: true,
      }),
    ).toThrow();
  });

  it('rejects too many rows', () => {
    const rows = Array.from({ length: MAX_TABLE_ROWS + 1 }, () => ({ a: 1 }));
    expect(() =>
      dataTableDataSchema.parse({ columns: [{ key: 'a', header: 'A' }], rows }),
    ).toThrow();
  });

  it('rejects object cell values', () => {
    expect(() =>
      dataTableDataSchema.parse({
        columns: [{ key: 'a', header: 'A' }],
        rows: [{ a: { nested: true } }],
      }),
    ).toThrow();
  });
});

describe('kvCardDataSchema', () => {
  it('accepts a valid card', () => {
    expect(
      kvCardDataSchema.parse({
        title: 'Acme Corp',
        fields: [{ label: 'Status', value: 'Active', type: 'badge' }],
      }),
    ).toBeTruthy();
  });

  it('rejects empty fields', () => {
    expect(() => kvCardDataSchema.parse({ title: 't', fields: [] })).toThrow();
  });
});

describe('statGroupDataSchema', () => {
  it('accepts valid stats with delta', () => {
    expect(
      statGroupDataSchema.parse({
        items: [{ label: 'Revenue', value: 1000, delta: { value: 5, direction: 'up' } }],
      }),
    ).toBeTruthy();
  });

  it('rejects > 8 items', () => {
    const items = Array.from({ length: 9 }, (_, i) => ({ label: `l${i}`, value: i }));
    expect(() => statGroupDataSchema.parse({ items })).toThrow();
  });
});

describe('noticeDataSchema', () => {
  it('accepts all variants', () => {
    for (const variant of ['info', 'success', 'warning', 'error'] as const) {
      expect(noticeDataSchema.parse({ variant, message: 'hi' })).toBeTruthy();
    }
  });

  it('rejects unknown variant', () => {
    expect(() => noticeDataSchema.parse({ variant: 'danger', message: 'x' })).toThrow();
  });
});

describe('markdownDataSchema', () => {
  it('accepts short content', () => {
    expect(markdownDataSchema.parse({ content: '# hi' })).toBeTruthy();
  });

  it('rejects oversize content', () => {
    expect(() =>
      markdownDataSchema.parse({ content: 'x'.repeat(MAX_MARKDOWN_CHARS + 1) }),
    ).toThrow();
  });
});

describe('normalizedBlockSchema', () => {
  it('accepts a data_table block', () => {
    expect(
      normalizedBlockSchema.parse({
        type: 'data_table',
        id: 'm:0',
        data: { columns: [{ key: 'a', header: 'A' }], rows: [] },
      }),
    ).toBeTruthy();
  });

  it('rejects a mismatched discriminator', () => {
    expect(() =>
      normalizedBlockSchema.parse({
        type: 'notice',
        id: 'm:0',
        data: { columns: [], rows: [] },
      }),
    ).toThrow();
  });
});

describe('blockTypeSchema', () => {
  it('enumerates exactly the Phase 1 types', () => {
    expect(blockTypeSchema.options.sort()).toEqual(
      ['data_table', 'kv_card', 'markdown', 'notice', 'stat_group'].sort(),
    );
  });
});

describe('normalizedAIResponseSchema', () => {
  it('accepts a minimal response', () => {
    expect(
      normalizedAIResponseSchema.parse({
        text: 'hi',
        blocks: [],
      }),
    ).toBeTruthy();
  });

  it('rejects unknown top-level keys', () => {
    expect(() =>
      normalizedAIResponseSchema.parse({ blocks: [], unexpected: true }),
    ).toThrow();
  });
});
