# @mcp-interactive-ui/react

React renderer for `@mcp-interactive-ui`. Exports `<RenderAIContent />` plus one component per registered block, all built on shadcn-compatible Tailwind classes.

## Install

```bash
pnpm add @mcp-interactive-ui/react @mcp-interactive-ui/types react react-dom
```

Your app must have Tailwind CSS configured with shadcn's default tokens (`--background`, `--foreground`, `--muted`, `--primary`, `--card`, `--border`, etc.). The components use only those tokens — no hard-coded colors except for notice variants (where semantic color is intrinsic).

## Usage

```tsx
import { RenderAIContent } from '@mcp-interactive-ui/react';

export function ChatMessage({ response }: { response: NormalizedAIResponse }) {
  return <RenderAIContent data={response} />;
}
```

### Overriding a block component

```tsx
import { RenderAIContent, type BlockComponentMap } from '@mcp-interactive-ui/react';
import { MyCustomTable } from './MyCustomTable';

<RenderAIContent
  data={response}
  components={{ data_table: MyCustomTable }}
/>;
```

### Guarantees

- `RenderAIContent` never fetches.
- Dispatch is by `block.type` only — no inference from labels.
- Markdown is sanitized (strict rehype-sanitize allowlist).
- Only `http(s)` and `mailto:` hrefs are rendered as anchors.
