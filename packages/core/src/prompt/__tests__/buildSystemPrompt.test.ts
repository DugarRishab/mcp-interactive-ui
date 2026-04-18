import { describe, it, expect, beforeEach } from 'vitest';
import { __resetRegistryForTests, buildSystemPrompt, getDefaultRegistry } from '../../index.js';

describe('buildSystemPrompt', () => {
  beforeEach(() => __resetRegistryForTests());

  it('is deterministic (sorted by id)', () => {
    const r = getDefaultRegistry();
    const a = buildSystemPrompt(r);
    const b = buildSystemPrompt(r);
    expect(a).toBe(b);
  });

  it('lists every registered block in sorted order', () => {
    const r = getDefaultRegistry();
    const prompt = buildSystemPrompt(r);
    const idOrder = ['data_table', 'kv_card', 'markdown', 'notice', 'stat_group'];
    let lastIdx = -1;
    for (const id of idOrder) {
      const idx = prompt.indexOf(`\`${id}\``);
      expect(idx).toBeGreaterThan(lastIdx);
      lastIdx = idx;
    }
  });

  it('contains the render_ui_block tool directive', () => {
    const r = getDefaultRegistry();
    const prompt = buildSystemPrompt(r);
    expect(prompt).toContain('render_ui_block');
    expect(prompt).toContain('Unknown keys are rejected');
  });

  it('embeds each block example as parseable JSON', () => {
    const r = getDefaultRegistry();
    const prompt = buildSystemPrompt(r);
    const exampleLines = prompt.split('\n').filter((l) => l.includes('Example `data`:'));
    expect(exampleLines.length).toBe(r.all().length);
    for (const line of exampleLines) {
      const json = line.slice(line.indexOf('{'));
      expect(() => JSON.parse(json)).not.toThrow();
    }
  });
});
