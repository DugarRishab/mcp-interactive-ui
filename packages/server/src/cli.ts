#!/usr/bin/env node
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { createMCPServer } from './server.js';

/**
 * CLI entrypoint. Currently supports stdio only; HTTP transport will land
 * alongside the upcoming MCP SDK HTTP server helpers.
 *
 * Usage:
 *   mcp-interactive-ui-server
 *   mcp-interactive-ui-server --transport stdio
 */
async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const transportArgIdx = args.indexOf('--transport');
  const transport =
    transportArgIdx >= 0 ? args[transportArgIdx + 1] ?? 'stdio' : 'stdio';

  if (transport !== 'stdio') {
    // eslint-disable-next-line no-console
    console.error(
      `Unsupported transport "${transport}". Only "stdio" is available in Phase 1.`,
    );
    process.exit(2);
  }

  const server = createMCPServer();
  const stdio = new StdioServerTransport();
  await server.connect(stdio);
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error('[mcp-interactive-ui-server] fatal:', err);
  process.exit(1);
});
