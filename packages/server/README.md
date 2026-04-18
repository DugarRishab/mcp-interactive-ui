# @mcp-interactive-ui/server

LLM-agnostic [Model Context Protocol](https://modelcontextprotocol.io/) server exposing the `@mcp-interactive-ui/core` block registry as MCP tools.

## Install

```bash
pnpm add @mcp-interactive-ui/server
# or run directly:
npx @mcp-interactive-ui/server
```

## Tools exposed

- `get_available_ui_blocks({ category? })` — lists block ids, descriptions, JSON schemas, and examples.
- `render_ui_block({ blockId, data })` — validates a payload and returns a normalized block, or a structured error.

## Claude Desktop configuration

```json
{
  "mcpServers": {
    "mcp-interactive-ui": {
      "command": "npx",
      "args": ["-y", "@mcp-interactive-ui/server"]
    }
  }
}
```

## Programmatic

```ts
import { createMCPServer } from '@mcp-interactive-ui/server';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

const server = createMCPServer();
await server.connect(new StdioServerTransport());
```

Use your own registry:

```ts
import { buildRegistry } from '@mcp-interactive-ui/core';
import { createMCPServer } from '@mcp-interactive-ui/server';

const registry = buildRegistry();
const server = createMCPServer({ registry });
```

Phase 1 supports the **stdio** transport only. HTTP lands in a later release.
