# Architecture

This is a condensed reference for contributors. 

## Data flow

```
backend
  OpenAI (or compatible) ⇄ @mcp-interactive-ui/core
        registryToOpenAITools(registry)
        parseOpenAIToolCalls(message) → RawBlock[]
        normalizeLLMResponse(raw, registry) → NormalizedAIResponse

  ── OR via MCP runtime ──

  Claude / LangChain / n8n ⇄ @mcp-interactive-ui/server
        MCP tools: get_available_ui_blocks, render_ui_block
        (internally calls @mcp-interactive-ui/core)

                            │ JSON: NormalizedAIResponse
                            ▼
frontend
  <RenderAIContent data={response} /> from @mcp-interactive-ui/react
        pure dispatcher on block.type
        shadcn-backed block components
```

## Package graph

```
types  (zod only)
  ▲
  └── core  (+ zod, zod-to-json-schema)
        ▲
        ├── react   (peer: react, react-dom)
        └── server  (+ @modelcontextprotocol/sdk)
```

## Why these boundaries

- **`types` has no logic.** Keeps the schema contract trivially auditable.
- **`core` has no transport.** Runs in Node, Bun, Edge, or Deno without changes.
- **`react` has no network.** `<RenderAIContent />` is a pure dispatcher; the host owns fetching.
- **`server` has no LLM knowledge.** It's an MCP wrapper; the LLM is in the client.

## Safety invariants

1. `normalizeLLMResponse` never throws. Every return value parses against `normalizedAIResponseSchema`.
2. Unknown block types become a `notice` with `variant: 'warning'`.
3. Schema-invalid blocks become a `notice` with `variant: 'warning'` containing the first issue's path/message.
4. The renderer dispatches by `block.type` only — never by labels, class names, or free text.
5. Markdown is sanitized. Only `http(s)` and `mailto:` anchors are kept.

## Testing invariants

- Every schema has both positive and negative cases.
- `normalizeLLMResponse` has a property test that feeds random garbage and asserts the result still parses against the response schema.
- `buildSystemPrompt(registry)` is snapshot-tested — changes are visible in code review.
