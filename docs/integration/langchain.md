# LangChain Integration

`@mcp-interactive-ui/langchain` provides tools and utilities for integrating with LangChain, converting tool outputs into interactive UI blocks.

## Installation

```bash
npm install @mcp-interactive-ui/langchain @langchain/core @langchain/openai
```

## Quick Start

```typescript
import { ChatOpenAI } from '@langchain/openai'
import { 
  createLangChainTools, 
  invokeWithUI,
  buildSystemMessage 
} from '@mcp-interactive-ui/langchain'
import { createRegistry } from '@mcp-interactive-ui/core'

// Create registry with all blocks
const registry = createRegistry()

// Initialize LangChain model
const model = new ChatOpenAI({ 
  modelName: 'gpt-4',
  temperature: 0 
})

// Create LangChain tools from registry
const tools = createLangChainTools(registry)

// Bind tools to model
const modelWithTools = model.bindTools(tools)

// Invoke with automatic UI parsing
const response = await invokeWithUI(
  modelWithTools,
  'Show me a dashboard with sales metrics',
  registry
)

// response: { text: '...', blocks: [...] }
```

## Manual Tool Binding

```typescript
import { tool } from '@langchain/core/tools'
import { createLangChainTools } from '@mcp-interactive-ui/langchain'

// Get tools from registry
const tools = createLangChainTools(registry)

// Use with any LangChain agent
const agent = createReactAgent({
  llm: model,
  tools,
  prompt: buildSystemMessage(registry)
})

const result = await agent.invoke({ 
  input: 'Create a data table' 
})
```

## Custom Tool Wrappers

```typescript
import { wrapBlockAsTool } from '@mcp-interactive-ui/langchain'

// Wrap a single block as a tool
const dataTableTool = wrapBlockAsTool(registry.get('data_table'), {
  // Enhance tool description for LLM
  description: 'Create a data table with columns and rows. ' +
    'Use for displaying structured tabular data.'
})

// Use directly with LangChain
const result = await dataTableTool.invoke({
  columns: [...],
  rows: [...]
})
```

## React Integration

```tsx
import { useState } from 'react'
import { RenderAIContent } from '@mcp-interactive-ui/react'
import { ChatOpenAI } from '@langchain/openai'
import { invokeWithUI } from '@mcp-interactive-ui/langchain'
import { createRegistry } from '@mcp-interactive-ui/core'

const model = new ChatOpenAI({ modelName: 'gpt-4' })
const registry = createRegistry()

function App() {
  const [response, setResponse] = useState(null)
  const [loading, setLoading] = useState(false)

  async function sendMessage(message: string) {
    setLoading(true)
    try {
      const result = await invokeWithUI(
        model,
        message,
        registry
      )
      setResponse(result)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <input 
        onKeyPress={(e) => {
          if (e.key === 'Enter') {
            sendMessage(e.currentTarget.value)
          }
        }}
      />
      {loading && <div>Loading...</div>}
      {response && (
        <RenderAIContent 
          data={response}
          onBlockAction={async (action) => {
            // Handle form submissions, button clicks, etc.
            console.log('Action:', action)
          }}
        />
      )}
    </div>
  )
}
```

## Streaming Support

```typescript
import { streamWithUI } from '@mcp-interactive-ui/langchain'

const stream = await streamWithUI(
  model,
  'Generate a report',
  registry
)

for await (const chunk of stream) {
  if (chunk.type === 'text') {
    // Handle text delta
    process.stdout.write(chunk.content)
  } else if (chunk.type === 'block') {
    // Handle complete block
    console.log('New block:', chunk.block)
  }
}
```

## Agent Integration

```typescript
import { createReactAgent } from '@langchain/agents'
import { createLangChainTools, buildSystemMessage } from '@mcp-interactive-ui/langchain'

const tools = createLangChainTools(registry)

const agent = createReactAgent({
  llm: model,
  tools,
  prompt: buildSystemMessage(registry, {
    instructions: 'Always use interactive blocks when displaying data.'
  })
})

// The agent will automatically use UI blocks for responses
const result = await agent.invoke({
  input: 'Show me sales data and let me filter it'
})
```

## Type Safety

```typescript
import type { 
  LangChainAdapterOptions,
  ToolResult,
  UIResponse 
} from '@mcp-interactive-ui/langchain'

const options: LangChainAdapterOptions = {
  model: model,
  registry: registry,
  maxBlocks: 10
}

const response: UIResponse = await invokeWithUI(
  model,
  'Show data',
  registry,
  options
)
```

## Error Handling

```typescript
import { 
  invokeWithUI,
  LangChainUIError 
} from '@mcp-interactive-ui/langchain'

try {
  const response = await invokeWithUI(model, message, registry)
} catch (error) {
  if (error instanceof LangChainUIError) {
    // Handle UI-specific errors
    if (error.code === 'INVALID_BLOCK_DATA') {
      // Block validation failed
    }
  }
}
```

## Chain Composition

```typescript
import { RunnableSequence } from '@langchain/core/runnables'
import { 
  blockOutputParser,
  uiResponseParser 
} from '@mcp-interactive-ui/langchain'

const chain = RunnableSequence.from([
  model,
  blockOutputParser(registry),
  uiResponseParser
])

const result = await chain.invoke('Create a dashboard')
```
