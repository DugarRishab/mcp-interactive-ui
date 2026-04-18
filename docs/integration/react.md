# React integration

```tsx
import { RenderAIContent } from '@mcp-interactive-ui/react';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';

export function ChatMessage({ response }: { response: NormalizedAIResponse }) {
  return <RenderAIContent data={response} />;
}
```

## Tailwind / shadcn requirements

Your app must have Tailwind CSS configured with shadcn's default design tokens (`--background`, `--foreground`, `--muted`, `--muted-foreground`, `--primary`, `--card`, `--card-foreground`, `--border`). Run `npx shadcn-ui@latest init` if you haven't already.

## Overriding block components

```tsx
import { RenderAIContent, type BlockComponentMap } from '@mcp-interactive-ui/react';
import { MyFancyTable } from './MyFancyTable';

<RenderAIContent
  data={response}
  components={{ data_table: MyFancyTable }}
/>;
```

Overrides receive the same `{ data, className? }` props as the built-ins.

## Unknown blocks

If the server returns a block type the renderer doesn't recognize (e.g., an older client paired with a newer server), it falls back to a `notice`. You can observe this via `onUnknownBlock`:

```tsx
<RenderAIContent
  data={response}
  onUnknownBlock={(block) => console.warn('unknown block', block.type)}
/>
```
