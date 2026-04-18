# OpenAI-compatible integration

Works with OpenAI, Groq, Together, Mistral, local vLLM — anything that speaks the OpenAI Chat Completions tool-calling dialect.

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

export async function chat(userMessage: string) {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt(registry) },
      { role: 'user', content: userMessage },
    ],
    tools: registryToOpenAITools(registry),
    tool_choice: 'auto',
  });

  const message = completion.choices[0]!.message;
  const rawBlocks = parseOpenAIToolCalls(message);

  return normalizeLLMResponse(
    {
      text: message.content ?? undefined,
      blocks: rawBlocks,
      messageId: completion.id,
      metadata: { model: completion.model },
    },
    registry,
  );
}
```

Return the resulting `NormalizedAIResponse` to your frontend (any transport) and render it with `<RenderAIContent />`.
