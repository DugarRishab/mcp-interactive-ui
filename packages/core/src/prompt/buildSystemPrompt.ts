import type { FrozenRegistry } from '../registry/registry.js';

/**
 * Deterministically generate the system-prompt fragment that teaches an LLM
 * about the available UI blocks. Output is sorted and snapshot-testable.
 *
 * The prompt instructs the model to call `render_ui_block(blockId, data)` for
 * each block it wants rendered. Wire format details (tool-call schemas) are
 * produced by the adapter layer (`openai/registryToOpenAITools`).
 */
export function buildSystemPrompt(registry: FrozenRegistry): string {
  const blocks = [...registry.all()].sort((a, b) => a.id.localeCompare(b.id));

  const lines: string[] = [
    'You can attach structured UI blocks to your responses via the `render_ui_block` tool.',
    'Only the following block types are allowed. Any other type will be discarded.',
    '',
  ];

  for (const b of blocks) {
    lines.push(`- \`${b.id}\` (${b.category}): ${b.description}`);
    lines.push(`  Example \`data\`: ${JSON.stringify(b.example)}`);
  }

  lines.push('');
  lines.push('Rules:');
  lines.push(
    '  1. Call `render_ui_block` once per block. Do not emit HTML, images, or invented block types.',
  );
  lines.push('  2. `data` MUST exactly match the block schema. Unknown keys are rejected.');
  lines.push(
    '  3. Prefer at most one block per response unless multiple are clearly justified.',
  );
  lines.push('  4. Plain narrative text goes in the normal message content, not in a block.');

  return lines.join('\n');
}
