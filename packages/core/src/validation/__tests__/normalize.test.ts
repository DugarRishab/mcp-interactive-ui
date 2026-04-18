import { describe, it, expect, beforeEach } from 'vitest';
import {
  __resetRegistryForTests,
  getDefaultRegistry,
  normalizeLLMResponse,
} from '../../index.js';

describe('normalizeLLMResponse', () => {
  beforeEach(() => __resetRegistryForTests());

  it('passes through valid blocks', () => {
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      {
        text: 'hello',
        blocks: [
          {
            type: 'notice',
            data: { variant: 'info', message: 'hi' },
          },
        ],
        messageId: 'm1',
      },
      r,
    );
    expect(out.text).toBe('hello');
    expect(out.blocks).toHaveLength(1);
    expect(out.blocks[0]!.type).toBe('notice');
    expect(out.blocks[0]!.id).toBe('m1:0');
  });

  it('replaces unknown types with a warning notice', () => {
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      { blocks: [{ type: 'chart_3d', data: {} }] },
      r,
    );
    expect(out.blocks[0]!.type).toBe('notice');
    if (out.blocks[0]!.type === 'notice') {
      expect(out.blocks[0]!.data.variant).toBe('warning');
    }
  });

  it('replaces schema-invalid data with a warning notice', () => {
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      { blocks: [{ type: 'data_table', data: { columns: [], rows: [] } }] },
      r,
    );
    expect(out.blocks[0]!.type).toBe('notice');
  });

  it('never throws on arbitrary garbage input', () => {
    const r = getDefaultRegistry();
    const garbage: unknown[] = [
      null,
      undefined,
      42,
      'string',
      { blocks: null },
      { blocks: [{}] },
      { blocks: [{ type: null, data: null }] },
      { blocks: [{ type: 'data_table', data: 'nope' }] },
      { blocks: Array.from({ length: 20 }, () => ({ type: 'x', data: {} })) },
    ];
    for (const g of garbage) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(() => normalizeLLMResponse(g as any, r)).not.toThrow();
    }
  });

  it('invokes telemetry hooks', () => {
    const r = getDefaultRegistry();
    const events: { reasons: Record<string, number>; total: number }[] = [];
    const errs: { code: string }[] = [];
    normalizeLLMResponse(
      {
        blocks: [
          { type: 'unknown_x', data: {} },
          { type: 'notice', data: { variant: 'info', message: 'ok' } },
        ],
      },
      r,
      {
        telemetry: {
          onNormalize: (e) => events.push({ reasons: e.reasons, total: e.total }),
          onValidationError: (e) => errs.push({ code: e.code }),
        },
      },
    );
    expect(events[0]!.total).toBe(2);
    expect(events[0]!.reasons.UNKNOWN_BLOCK_TYPE).toBe(1);
    expect(errs.map((e) => e.code)).toContain('UNKNOWN_BLOCK_TYPE');
  });

  it('uses deterministic block ids', () => {
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      {
        messageId: 'msg-42',
        blocks: [
          { type: 'notice', data: { variant: 'info', message: 'a' } },
          { type: 'notice', data: { variant: 'info', message: 'b' } },
        ],
      },
      r,
    );
    expect(out.blocks.map((b) => b.id)).toEqual(['msg-42:0', 'msg-42:1']);
  });

  it('honors caller-supplied ids', () => {
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      {
        blocks: [{ id: 'custom-id', type: 'notice', data: { variant: 'info', message: 'x' } }],
      },
      r,
    );
    expect(out.blocks[0]!.id).toBe('custom-id');
  });

  it('output always parses against normalizedAIResponseSchema', async () => {
    const { normalizedAIResponseSchema } = await import('@mcp-interactive-ui/types');
    const r = getDefaultRegistry();
    const out = normalizeLLMResponse(
      {
        text: 'x',
        blocks: [
          { type: 'nope', data: {} },
          { type: 'notice', data: { variant: 'info', message: 'ok' } },
          { type: 'data_table', data: 'invalid' },
        ],
      },
      r,
    );
    expect(() => normalizedAIResponseSchema.parse(out)).not.toThrow();
  });
});
