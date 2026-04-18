# @mcp-interactive-ui/core

Registry, validators, normalizer, and OpenAI tool adapters. Framework-agnostic; safe to import from any Node ≥ 18 backend.

## Install

```bash
pnpm add @mcp-interactive-ui/core @mcp-interactive-ui/types zod
```

## Quick start

```ts
import OpenAI from 'openai';
import {
  getDefaultRegistry,
  registryToOpenAITools,
  parseOpenAIToolCalls,
  buildSystemPrompt,
  normalizeLLMResponse,
} from '@mcp-interactive-ui/core';

const registry = getDefaultRegistry();
const openai = new OpenAI();

const completion = await openai.chat.completions.create({
  model: 'gpt-4o-mini',
  messages: [
    { role: 'system', content: buildSystemPrompt(registry) },
    { role: 'user', content: 'Show me hot leads' },
  ],
  tools: registryToOpenAITools(registry),
  tool_choice: 'auto',
});

const message = completion.choices[0]!.message;
const rawBlocks = parseOpenAIToolCalls(message);

const response = normalizeLLMResponse(
  {
    text: message.content ?? undefined,
    blocks: rawBlocks,
    messageId: completion.id,
    metadata: { model: completion.model },
  },
  registry,
);

// Send `response` to your frontend. Render it with <RenderAIContent />.
```

## Extending the registry

```ts
import { registerBlock, buildRegistry } from '@mcp-interactive-ui/core';

// Phase 1: the closed set is the only allowed types. Custom block types are a
// Phase 2 feature; for now, use `registerBlock` only to OVERRIDE a built-in's
// description/example for your own prompt tuning.
```

## Guarantees

- `normalizeLLMResponse` never throws.
- Every block it returns passes `normalizedBlockSchema` from `@mcp-interactive-ui/types`.
- Unknown block types become a `notice` with `variant: 'warning'`.
- Invalid schemas become a `notice` with the first issue's message.
