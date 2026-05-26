# @mcp-interactive-ui

> shadcn, but for LLM outputs — with a schema the model cannot escape.

A transport-agnostic TypeScript library that lets an LLM emit strictly-typed, schema-validated UI blocks backed by [shadcn/ui](https://ui.shadcn.com), which a React renderer displays safely.

## Packages

| Package                                  | Purpose                                                          |
| ---------------------------------------- | ---------------------------------------------------------------- |
| [`@mcp-interactive-ui/types`](./packages/types)   | Zod schemas + TS types. Zero runtime logic.              |
| [`@mcp-interactive-ui/core`](./packages/core)     | Registry, validators, normalizer, tool adapters.  |
| [`@mcp-interactive-ui/react`](./packages/react)   | `<RenderAIContent />` + shadcn-backed block components.  |
| [`@mcp-interactive-ui/vue`](./packages/vue)       | Vue 3 components for rendering blocks.                   |
| [`@mcp-interactive-ui/server`](./packages/server) | MCP server wrapper exposing the registry as MCP tools.   |
| [`@mcp-interactive-ui/anthropic`](./packages/anthropic) | Anthropic SDK integration adapter.                  |
| [`@mcp-interactive-ui/langchain`](./packages/langchain) | LangChain integration adapter.                    |
| [`@mcp-interactive-ui/cli`](./packages/cli)       | CLI tooling for development and management.              |
| [`@mcp-interactive-ui/testing`](./packages/testing) | Testing utilities for blocks and responses.              |

## Block Catalog

25 schema-validated UI blocks across interactive, data display, content, navigation, and advanced categories. See [docs/blocks.md](./docs/blocks.md) for complete documentation.

**Interactive blocks:** `form_input`, `button_group`, `tabs`, `accordion`, `modal`, `progress`

**Data display:** `data_table`, `stat_group`, `metric_card`, `chart`, `comparison_table`

**Content:** `markdown`, `code`, `list`, `gallery`, `timeline`

**Navigation:** `breadcrumb`, `tree`, `carousel`

**Advanced:** `kv_card`, `badge_group`, `json_viewer`, `diff_viewer`, `kanban`, `notice`

## Quickstart (development)

```bash
pnpm install
pnpm build
pnpm test
```

Requires Node ≥ 18 and pnpm ≥ 9.

## How to add a new block

1. Add the Zod schema in `packages/types/src/blocks/<name>.ts` and export from `packages/types/src/blocks/index.ts`.
2. Add a `BlockDefinition` in `packages/core/src/registry/blocks/<name>.ts` and register in `packages/core/src/registry/defaults.ts`.
3. Add a React component in `packages/react/src/blocks/<Name>Block.tsx` and register in `packages/react/src/registry.tsx`.
4. Add a Vue component in `packages/vue/src/components/blocks/<Name>Block.vue` and export from `packages/vue/src/index.ts`.
5. Document in `docs/blocks.md` and add tests.
6. Run `pnpm changeset` and describe the change.

## Integration guides

- [OpenAI-compatible backend](./docs/integration/openai.md)
- [Claude Desktop via MCP](./docs/integration/mcp-claude-desktop.md)
- [React frontend](./docs/integration/react.md)

## License

MIT
