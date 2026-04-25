# Anthropic Integration

`@mcp-interactive-ui/anthropic` provides seamless integration with the Anthropic SDK, converting Claude's tool use responses into interactive UI blocks.

## Installation

```bash
npm install @mcp-interactive-ui/anthropic @anthropic-ai/sdk
```

## Quick Start

```typescript
import Anthropic from '@anthropic-ai/sdk'
import { 
  registryToAnthropicTools, 
  parseAnthropicResponse,
  buildSystemPrompt 
} from '@mcp-interactive-ui/anthropic'
import { createRegistry } from '@mcp-interactive-ui/core'

// Create registry with all blocks
const registry = createRegistry()

// Initialize Anthropic client
const anthropic = new Anthropic()

// Convert registry to Anthropic tools format
const tools = registryToAnthropicTools(registry)

// Call Claude with tools
const response = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 4096,
  system: buildSystemPrompt(registry),
  tools,
  messages: [{ 
    role: 'user', 
    content: 'Show me a data table of recent sales' 
  }]
})

// Parse response into normalized blocks
const normalized = parseAnthropicResponse(response, registry)
// { text: '...', blocks: [...] }
```

## System Prompt Generation

```typescript
import { buildSystemPrompt } from '@mcp-interactive-ui/anthropic'

const systemPrompt = buildSystemPrompt(registry, {
  maxBlocksPerResponse: 5,
  includeExamples: true
})
```

## Streaming Support

```typescript
import { streamAnthropicResponse } from '@mcp-interactive-ui/anthropic'

const stream = await anthropic.messages.create({
  model: 'claude-3-sonnet-20240229',
  max_tokens: 4096,
  tools,
  stream: true,
  messages: [{ role: 'user', content: 'Create a form' }]
})

for await (const chunk of stream) {
  const partial = streamAnthropicResponse(chunk, registry)
  // Handle partial blocks during streaming
}
```

## Tool Definition Mapping

```typescript
import { registryToAnthropicTools } from '@mcp-interactive-ui/anthropic'

const tools = registryToAnthropicTools(registry, {
  // Customize tool descriptions
  getDescription: (block) => `Render a ${block.type} component`,
  
  // Filter which blocks to expose
  filter: (block) => !block.type.startsWith('_')
})

// Returns: [{ name: 'data_table', description: '...', input_schema: {...} }, ...]
```

## React Integration

```tsx
import { useState } from 'react'
import { RenderAIContent } from '@mcp-interactive-ui/react'
import { createRegistry } from '@mcp-interactive-ui/core'
import { 
  registryToAnthropicTools, 
  parseAnthropicResponse,
  buildSystemPrompt 
} from '@mcp-interactive-ui/anthropic'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()
const registry = createRegistry()

function App() {
  const [response, setResponse] = useState(null)

  async function sendMessage(message: string) {
    const tools = registryToAnthropicTools(registry)
    
    const aiResponse = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 4096,
      system: buildSystemPrompt(registry),
      tools,
      messages: [{ role: 'user', content: message }]
    })

    setResponse(parseAnthropicResponse(aiResponse, registry))
  }

  return (
    <div>
      <button onClick={() => sendMessage('Show me a dashboard')}>
        Send
      </button>
      {response && (
        <RenderAIContent 
          data={response} 
          onBlockAction={(action) => console.log(action)}
        />
      )}
    </div>
  )
}
```

## Error Handling

```typescript
import { 
  parseAnthropicResponse,
  AnthropicResponseError 
} from '@mcp-interactive-ui/anthropic'

try {
  const normalized = parseAnthropicResponse(response, registry)
} catch (error) {
  if (error instanceof AnthropicResponseError) {
    // Handle malformed tool responses
    console.error('Invalid block data:', error.toolName)
  }
}
```

## Type Safety

```typescript
import type { 
  AnthropicAdapterOptions,
  ToolDefinition,
  ParsedResponse 
} from '@mcp-interactive-ui/anthropic'

const options: AnthropicAdapterOptions = {
  model: 'claude-3-sonnet-20240229',
  maxTokens: 4096,
  temperature: 0.7
}
```
