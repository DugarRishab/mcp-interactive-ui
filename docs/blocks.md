# Block catalog (Phase 1)

Five read-only block types. Every block has a stable id, a discriminator, a Zod schema, and a canonical example the LLM sees in the system prompt.

## `data_table`

Tabular data. Up to 20 columns, 500 rows, 200 chars per cell.

```ts
{
  columns: [{ key: string; header: string; type?: 'text' | 'number' | 'currency' | 'date' | 'badge' }];
  rows: Array<Record<string, string | number | boolean | null>>;
  caption?: string;
}
```

## `kv_card`

Single record, up to 30 labelled fields.

```ts
{
  title: string;
  subtitle?: string;
  fields: Array<{ label: string; value: string; type?: 'text' | 'badge' | 'link'; href?: string }>;
}
```

Only `http(s)` and `mailto:` hrefs render as clickable anchors.

## `stat_group`

1–8 KPI tiles.

```ts
{
  items: Array<{
    label: string;
    value: string | number;
    hint?: string;
    delta?: { value: number; direction: 'up' | 'down' | 'flat'; label?: string };
  }>;
}
```

## `notice`

Info / success / warning / error banner. Also the **fallback** block produced by the normalizer for any unknown or invalid LLM output.

```ts
{
  variant: 'info' | 'success' | 'warning' | 'error';
  title?: string;
  message: string;  // <= 2000 chars
}
```

## `markdown`

Up to 10,000 chars of GitHub-flavored markdown. Rendered through `rehype-sanitize` with a strict allowlist: no `<script>`, no `<iframe>`, no inline styles, no event handlers, no non-http(s)/mailto hrefs.

```ts
{ content: string }
```

## Adding a new block (Phase 2+)

1. Add the Zod schema in `packages/types/src/blocks/<name>.ts`.
2. Append to the `blockTypeSchema` enum, `normalizedBlockSchema` union, and `blockDataSchemaByType` in `packages/types/src/blocks/index.ts`.
3. Add a `BlockDefinition` in `packages/core/src/registry/blocks/<name>.ts` and include it in `BUILTIN_BLOCKS`.
4. Add a React component in `packages/react/src/blocks/<Name>Block.tsx`; wire it into `defaultBlockComponents`.
5. Snapshot-update `buildSystemPrompt`.
6. Add a `changeset`.
