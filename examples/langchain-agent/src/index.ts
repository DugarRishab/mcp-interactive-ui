import { blockRegistry, registryToOpenAITools, normalizeLLMResponse } from '@mcp-interactive-ui/core';
import type { BlockDefinition } from '@mcp-interactive-ui/types';

// Mock LLM response simulating an agent with UI blocks
const mockAgentResponse = {
  text: "I've analyzed your request. Here's what I found:",
  blocks: [
    {
      type: 'stat_group',
      id: 'analysis-results',
      data: {
        stats: [
          { label: 'Files Scanned', value: '1,234' },
          { label: 'Issues Found', value: '23' },
          { label: 'Time Taken', value: '2.3s' }
        ]
      }
    },
    {
      type: 'data_table',
      id: 'issues-table',
      data: {
        title: 'Top Issues',
        columns: [
          { key: 'file', title: 'File' },
          { key: 'line', title: 'Line' },
          { key: 'severity', title: 'Severity' },
          { key: 'message', title: 'Message' }
        ],
        rows: [
          { file: 'src/utils.ts', line: '42', severity: 'high', message: 'Unused variable' },
          { file: 'src/app.ts', line: '15', severity: 'medium', message: 'Deprecated API' }
        ]
      }
    },
    {
      type: 'button_group',
      id: 'actions',
      data: {
        title: 'Actions',
        buttons: [
          { id: 'fix-all', label: 'Fix All Issues', variant: 'primary' },
          { id: 'export', label: 'Export Report', variant: 'secondary' },
          { id: 'ignore', label: 'Ignore Warnings', variant: 'outline' }
        ]
      }
    }
  ]
};

// Mock tool execution
const mockToolExecution = async (toolName: string, params: Record<string, unknown>) => {
  console.log(`Executing tool: ${toolName}`, params);

  switch (toolName) {
    case 'analyze_code':
      return mockAgentResponse;
    case 'generate_report':
      return {
        text: 'Report generated successfully!',
        blocks: [{
          type: 'kv_card',
          id: 'report-info',
          data: {
            title: 'Report Details',
            items: [
              { label: 'Filename', value: 'analysis-report.pdf' },
              { label: 'Size', value: '245 KB' },
              { label: 'Generated', value: new Date().toLocaleString() }
            ]
          }
        }]
      };
    default:
      return { text: `Unknown tool: ${toolName}` };
  }
};

// Mock registry with tools
const mockRegistry = {
  getAvailableBlocks: () => ['stat_group', 'data_table', 'button_group', 'kv_card'],
  getBlockDefinition: (type: string): BlockDefinition | undefined => {
    const definitions: Record<string, BlockDefinition> = {
      stat_group: {
        type: 'stat_group',
        schema: { type: 'object', properties: {} },
        render: () => null
      },
      data_table: {
        type: 'data_table',
        schema: { type: 'object', properties: {} },
        render: () => null
      },
      button_group: {
        type: 'button_group',
        schema: { type: 'object', properties: {} },
        render: () => null
      },
      kv_card: {
        type: 'kv_card',
        schema: { type: 'object', properties: {} },
        render: () => null
      }
    };
    return definitions[type];
  }
};

// Agent class
class UIBlockAgent {
  private registry: typeof mockRegistry;

  constructor(registry: typeof mockRegistry) {
    this.registry = registry;
  }

  async chat(userMessage: string) {
    console.log('\n👤 User:', userMessage);

    // Simulate LLM processing and tool selection
    let response;
    if (userMessage.includes('analyze') || userMessage.includes('scan')) {
      response = await mockToolExecution('analyze_code', { path: './src' });
    } else if (userMessage.includes('report')) {
      response = await mockToolExecution('generate_report', { format: 'pdf' });
    } else {
      response = {
        text: 'I can help you analyze code or generate reports. Try saying "analyze my code" or "generate a report".',
        blocks: [{
          type: 'button_group',
          id: 'suggestions',
          data: {
            buttons: [
              { id: 'analyze', label: 'Analyze Code', variant: 'primary' },
              { id: 'report', label: 'Generate Report', variant: 'secondary' }
            ]
          }
        }]
      };
    }

    // Normalize response
    const normalized = normalizeLLMResponse(response, this.registry);

    console.log('\n🤖 Agent:', normalized.text);

    if (normalized.blocks && normalized.blocks.length > 0) {
      console.log('\n📦 UI Blocks rendered:');
      normalized.blocks.forEach((block, idx) => {
        console.log(`  ${idx + 1}. ${block.type} (id: ${block.id})`);
      });
    }

    return normalized;
  }
}

// Demo
async function main() {
  console.log('🚀 LangChain Agent Example with MCP Interactive UI\n');

  const agent = new UIBlockAgent(mockRegistry);

  // Simulate conversation
  await agent.chat('analyze my codebase');
  console.log('\n---\n');

  await agent.chat('generate a report');
  console.log('\n---\n');

  await agent.chat('hello');

  console.log('\n✅ Demo complete!');
}

main().catch(console.error);
