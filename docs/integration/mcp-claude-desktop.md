# Claude Desktop via MCP

Add the server to `claude_desktop_config.json`:

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

Restart Claude Desktop. Two tools appear:

- `get_available_ui_blocks` — Claude calls this to discover block schemas.
- `render_ui_block` — Claude calls this to emit a validated block in its reply.

Since Claude Desktop currently renders tool results as JSON text, the block payload is visible in the conversation. To render it visually, use the same `@mcp-interactive-ui/server` from your own MCP client (e.g., LangChain's MCP adapter) and pipe `render_ui_block` results into `<RenderAIContent />`.
