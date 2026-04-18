# @mcp-interactive-ui/types

Shared Zod schemas and TypeScript types for the `@mcp-interactive-ui/*` ecosystem. Zero runtime logic.

## Install

```bash
pnpm add @mcp-interactive-ui/types zod
```

## What's exported

- `blockTypeSchema`, `BlockType` — the closed Phase-1 union (`data_table`, `kv_card`, `stat_group`, `notice`, `markdown`).
- Per-block data schemas: `dataTableDataSchema`, `kvCardDataSchema`, `statGroupDataSchema`, `noticeDataSchema`, `markdownDataSchema`.
- `normalizedBlockSchema`, `NormalizedBlock` — the discriminated union emitted by the server.
- `normalizedAIResponseSchema`, `NormalizedAIResponse` — the full wire-format response.
- `BlockDefinition<T>` — the meta-type used by the core registry.
- `blockDataSchemaByType` — lookup table for generic validators.

All shapes are `z.strict()` where possible; unknown keys are rejected.
