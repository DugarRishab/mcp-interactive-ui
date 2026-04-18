# @mcp-interactive-ui

> shadcn, but for LLM outputs — with a schema the model cannot escape.

A transport-agnostic TypeScript library that lets an LLM emit strictly-typed, schema-validated UI blocks backed by [shadcn/ui](https://ui.shadcn.com), which a React renderer displays safely.

## Packages

| Package                                  | Purpose                                                          |
| ---------------------------------------- | ---------------------------------------------------------------- |
| [`@mcp-interactive-ui/types`](./packages/types)   | Zod schemas + TS types. Zero runtime logic.              |
| [`@mcp-interactive-ui/core`](./packages/core)     | Registry, validators, normalizer, OpenAI tool adapters.  |
| [`@mcp-interactive-ui/react`](./packages/react)   | `<RenderAIContent />` + shadcn-backed block components.  |
| [`@mcp-interactive-ui/server`](./packages/server) | MCP server wrapper exposing the registry as MCP tools.   |

## Phase 1 block catalog

`data_table`, `kv_card`, `stat_group`, `notice`, `markdown`. Read-only. See [docs/blocks.md](./docs/blocks.md).

Interactive actions (selection, forms, follow-up LLM calls) are Phase 2.

## Quickstart (development)

```bash
pnpm install
pnpm build
pnpm test
```

Requires Node ≥ 18 and pnpm ≥ 9.

## How to add a new block

1. Add a Zod schema in `packages/types/src/blocks/<name>.ts` and export from `packages/types/src/index.ts`.
2. Add a `BlockDefinition` in `packages/core/src/registry/blocks/<name>.ts` and register it in `packages/core/src/registry/defaults.ts`.
3. Add a React component in `packages/react/src/blocks/<Name>Block.tsx` and register it in `packages/react/src/registry.tsx`.
4. Document it in `docs/blocks.md`.
5. Add tests.
6. Run `pnpm changeset` and describe the change.

## Integration guides

- [OpenAI-compatible backend](./docs/integration/openai.md)
- [Claude Desktop via MCP](./docs/integration/mcp-claude-desktop.md)
- [React frontend](./docs/integration/react.md)

## License

MIT
