import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { zodToJsonSchema } from 'zod-to-json-schema';
import { getDefaultRegistry, type FrozenRegistry } from '@mcp-interactive-ui/core';
import {
  GET_AVAILABLE_UI_BLOCKS,
  RENDER_UI_BLOCK,
  getAvailableUIBlocks,
  getAvailableUIBlocksInputSchema,
  renderUIBlock,
  renderUIBlockInputSchema,
} from './tools.js';

export interface CreateMCPServerOptions {
  /** Defaults to `getDefaultRegistry()`. Pass your own for custom registration. */
  registry?: FrozenRegistry;
  /** Server name advertised to the MCP client. */
  name?: string;
  /** Server version string. */
  version?: string;
}

/**
 * Build an MCP server instance with the two Phase 1 tools wired up.
 * Transport wiring (stdio/HTTP) is done by the caller (see cli.ts).
 */
export function createMCPServer(options: CreateMCPServerOptions = {}): Server {
  const registry = options.registry ?? getDefaultRegistry();
  const server = new Server(
    {
      name: options.name ?? '@mcp-interactive-ui/server',
      version: options.version ?? '0.1.0',
    },
    { capabilities: { tools: {} } },
  );

  server.setRequestHandler(ListToolsRequestSchema, () => ({
    tools: [
      {
        name: GET_AVAILABLE_UI_BLOCKS,
        description:
          'List the UI block types this server can render, including their JSON schemas and usage examples.',
        inputSchema: zodToJsonSchema(getAvailableUIBlocksInputSchema, {
          target: 'openApi3',
        }) as Record<string, unknown>,
      },
      {
        name: RENDER_UI_BLOCK,
        description:
          'Validate a block payload and return a normalized UI block that the client can render. Returns a structured error on schema failure.',
        inputSchema: zodToJsonSchema(renderUIBlockInputSchema, {
          target: 'openApi3',
        }) as Record<string, unknown>,
      },
    ],
  }));

  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;

    if (name === GET_AVAILABLE_UI_BLOCKS) {
      const parsed = getAvailableUIBlocksInputSchema.parse(args ?? {});
      const result = getAvailableUIBlocks(parsed, registry);
      return { content: [{ type: 'text', text: JSON.stringify(result) }] };
    }

    if (name === RENDER_UI_BLOCK) {
      const parsed = renderUIBlockInputSchema.parse(args ?? {});
      const result = renderUIBlock(parsed, registry);
      return {
        content: [{ type: 'text', text: JSON.stringify(result) }],
        isError: !result.success,
      };
    }

    return {
      content: [{ type: 'text', text: `Unknown tool: ${name}` }],
      isError: true,
    };
  });

  return server;
}
