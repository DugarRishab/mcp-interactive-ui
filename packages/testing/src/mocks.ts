import type { NormalizedAIResponse, NormalizedBlock } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '@mcp-interactive-ui/core';

/**
 * Create a mock AI response
 */
export function createMockResponse(
  text: string = '',
  blocks: NormalizedBlock[] = []
): NormalizedAIResponse {
  return {
    text,
    blocks,
  };
}

/**
 * Create mock blocks for common types
 */
export function createMockBlocks(): Record<string, NormalizedBlock> {
  return {
    data_table: {
      type: 'data_table',
      id: 'mock-table-1',
      data: {
        columns: [
          { key: 'name', header: 'Name' },
          { key: 'value', header: 'Value' },
        ],
        rows: [
          { name: 'Item A', value: 100 },
          { name: 'Item B', value: 200 },
        ],
      },
    },
    form_input: {
      type: 'form_input',
      id: 'mock-form-1',
      data: {
        title: 'Contact Form',
        fields: [
          { name: 'email', type: 'email', label: 'Email', required: true },
          { name: 'message', type: 'textarea', label: 'Message', required: true },
        ],
      },
    },
    button_group: {
      type: 'button_group',
      id: 'mock-buttons-1',
      data: {
        actions: [
          { id: 'submit', label: 'Submit', variant: 'primary' },
          { id: 'cancel', label: 'Cancel', variant: 'secondary' },
        ],
      },
    },
    stat_group: {
      type: 'stat_group',
      id: 'mock-stats-1',
      data: {
        items: [
          { label: 'Users', value: 1234, delta: { value: 12, direction: 'up' } },
          { label: 'Revenue', value: '$50K', delta: { value: 5, direction: 'up' } },
        ],
      },
    },
    notice: {
      type: 'notice',
      id: 'mock-notice-1',
      data: {
        variant: 'info',
        title: 'Information',
        message: 'This is an informational notice.',
      },
    },
  };
}

/**
 * Mock LLM responses for testing
 */
export function mockLLMResponse(
  prompt: string,
  _registry: FrozenRegistry
): NormalizedAIResponse {
  const blocks: NormalizedBlock[] = [];

  const mockBlocks = createMockBlocks();

  // Simple keyword-based mock
  if (prompt.includes('form') && mockBlocks.form_input) {
    blocks.push(mockBlocks.form_input);
  }
  if ((prompt.includes('table') || prompt.includes('data')) && mockBlocks.data_table) {
    blocks.push(mockBlocks.data_table);
  }
  if ((prompt.includes('stats') || prompt.includes('metrics')) && mockBlocks.stat_group) {
    blocks.push(mockBlocks.stat_group);
  }

  return createMockResponse(
    `Mock response for: ${prompt.substring(0, 50)}...`,
    blocks
  );
}

/**
 * Create snapshot for regression testing
 */
export function createSnapshot(response: NormalizedAIResponse): string {
  return JSON.stringify(response, null, 2);
}

/**
 * Compare response to snapshot
 */
export function compareToSnapshot(
  response: NormalizedAIResponse,
  snapshot: string
): boolean {
  return JSON.stringify(response) === JSON.parse(snapshot);
}
