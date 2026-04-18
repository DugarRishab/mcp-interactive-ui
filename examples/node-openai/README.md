# example-node-openai

Minimal Node.js script that asks OpenAI to render a data table, then prints the resulting `NormalizedAIResponse` as JSON.

```bash
export OPENAI_API_KEY=sk-...
pnpm install
pnpm --filter example-node-openai start
```

Optional: set `MODEL=gpt-4o-mini` (default) or any OpenAI-compatible model.

This example is not published to npm — it lives in the monorepo purely for manual QA and to show the `core` package in realistic use.
