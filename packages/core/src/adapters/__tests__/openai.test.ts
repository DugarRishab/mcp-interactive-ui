import { describe, it, expect, beforeEach } from 'vitest';
import {
  __resetRegistryForTests,
  getDefaultRegistry,
  parseOpenAIToolCalls,
  registryToOpenAITools,
  RENDER_TOOL_NAME,
} from '../../index.js';

describe('registryToOpenAITools', () => {
  beforeEach(() => __resetRegistryForTests());

  it('emits a single render_ui_block tool with a oneOf union', () => {
    const r = getDefaultRegistry();
    const tools = registryToOpenAITools(r);
    expect(tools).toHaveLength(1);
    const fn = tools[0]!.function;
    expect(fn.name).toBe(RENDER_TOOL_NAME);
    const params = fn.parameters as {
      properties: { blockId: { enum: string[] } };
      oneOf: unknown[];
    };
    expect(params.properties.blockId.enum.sort()).toEqual([
      'data_table',
      'kv_card',
      'markdown',
      'notice',
      'stat_group',
    ]);
    expect(params.oneOf).toHaveLength(5);
  });
});

describe('parseOpenAIToolCalls', () => {
  beforeEach(() => __resetRegistryForTests());

  it('parses valid render_ui_block tool calls', () => {
    const raw = parseOpenAIToolCalls({
      role: 'assistant',
      content: null,
      tool_calls: [
        {
          id: 'call_1',
          type: 'function',
          function: {
            name: RENDER_TOOL_NAME,
            arguments: JSON.stringify({
              blockId: 'notice',
              data: { variant: 'info', message: 'hi' },
            }),
          },
        },
      ],
    });
    expect(raw).toHaveLength(1);
    expect(raw[0]).toMatchObject({ type: 'notice', id: 'call_1' });
  });

  it('ignores tool calls with other names', () => {
    const raw = parseOpenAIToolCalls({
      role: 'assistant',
      tool_calls: [
        {
          id: 'c',
          type: 'function',
          function: { name: 'something_else', arguments: '{}' },
        },
      ],
    });
    expect(raw).toHaveLength(0);
  });

  it('drops unparseable JSON by default', () => {
    const raw = parseOpenAIToolCalls({
      role: 'assistant',
      tool_calls: [
        {
          id: 'c',
          type: 'function',
          function: { name: RENDER_TOOL_NAME, arguments: '{not json' },
        },
      ],
    });
    expect(raw).toHaveLength(0);
  });

  it('surfaces unparseable JSON when requested', () => {
    const raw = parseOpenAIToolCalls(
      {
        role: 'assistant',
        tool_calls: [
          {
            id: 'c',
            type: 'function',
            function: { name: RENDER_TOOL_NAME, arguments: 'garbage' },
          },
        ],
      },
      { onParseError: 'surface' },
    );
    expect(raw).toHaveLength(1);
    expect(raw[0]!.type).toBe('__invalid__');
  });

  it('returns [] on a message with no tool_calls', () => {
    expect(parseOpenAIToolCalls({ role: 'assistant', content: 'hi' })).toEqual([]);
  });
});
