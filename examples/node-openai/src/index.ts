/**
 * Minimal example: call OpenAI with the @mcp-interactive-ui/core registry,
 * then print the normalized AI response.
 *
 * Usage (OpenAI):
 *   export OPENAI_API_KEY=sk-...
 *   export OPENAI_BASE_URL=https://api.openai.com/v1  # optional
 *   export OPENAI_GROUP_ID=org-...                    # optional
 *   pnpm --filter example-node-openai start
 *
 * Usage (MiniMax):
 *   export OPENAI_API_KEY=<your-minimax-api-key>
 *   export OPENAI_BASE_URL=https://api.minimaxi.chat/v1
 *   pnpm --filter example-node-openai start
 */
import 'dotenv/config';
import OpenAI from 'openai';
import {
  getDefaultRegistry,
  registryToOpenAITools,
  parseOpenAIToolCalls,
  buildSystemPrompt,
  normalizeLLMResponse,
} from '@mcp-interactive-ui/core';

async function main(): Promise<void> {
  const registry = getDefaultRegistry();

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error('OPENAI_API_KEY is required');
  }
  console.log(apiKey)

  // Custom fetch wrapper to ensure MiniMax gets raw Authorization header
  const customFetch = async (url: RequestInfo, init?: RequestInit): Promise<Response> => {
    const headers = new Headers(init?.headers);
    // MiniMax requires raw API key without 'Bearer' prefix
    headers.set('Authorization', apiKey);
    return fetch(url, { ...init, headers });
  };

  const openai = new OpenAI({
    baseURL: process.env.OPENAI_BASE_URL,
    // organization: process.env.OPENAI_GROUP_ID,
    apiKey: apiKey, // Required but MiniMax uses our custom header
    defaultHeaders: {
      "GroupId": process.env.OPENAI_GROUP_ID,
    },
  });

  const completion = await openai.chat.completions.create({
    model: process.env.MODEL ?? 'gpt-4o-mini',
    messages: [
      { role: 'system', content: buildSystemPrompt(registry) },
      {
        role: 'user',
        content: 'Show me a table of three sample customers with revenue.',
      },
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

  // eslint-disable-next-line no-console
  console.log(JSON.stringify(response, null, 2));
}

main().catch((err) => {
  // eslint-disable-next-line no-console
  console.error(err);
  process.exit(1);
});
