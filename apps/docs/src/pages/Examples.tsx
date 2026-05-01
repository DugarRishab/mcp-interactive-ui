import { CodeBlock } from "@/components/CodeBlock"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MessageSquare, LayoutDashboard, Bot, Server, ExternalLink } from "lucide-react"

const examples = [
  {
    name: "React Chat",
    path: "examples/react-chat",
    desc: "Full-featured chat interface with interactive UI blocks. Shows how to integrate with OpenAI streaming responses.",
    icon: MessageSquare,
    tags: ["React", "OpenAI", "Streaming"],
    code: `import { RenderAIContent } from '@mcp-interactive-ui/react';
import { useChat } from '@ai-sdk/react';

export function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  return (
    <div className="chat-container">
      {messages.map((message) => (
        <div key={message.id} className={message.role}>
          {message.role === 'user' ? (
            <p>{message.content}</p>
          ) : (
            <RenderAIContent 
              response={message.uiBlocks}
              onBlockAction={(action, data) => {
                console.log('Action:', action, data);
              }}
            />
          )}
        </div>
      ))}
      <form onSubmit={handleSubmit}>
        <input value={input} onChange={handleInputChange} />
      </form>
    </div>
  );
}`
  },
  {
    name: "Vue Dashboard",
    path: "examples/vue-dashboard",
    desc: "Analytics dashboard using Vue 3 components. Demonstrates data_table, stat_group, and chart blocks.",
    icon: LayoutDashboard,
    tags: ["Vue 3", "Dashboard", "Analytics"],
    code: `<script setup lang="ts">
import { RenderAIContent } from '@mcp-interactive-ui/vue';
import { ref } from 'vue';

const response = ref(null);

// Fetch dashboard data from API
async function loadDashboard() {
  const res = await fetch('/api/dashboard');
  response.value = await res.json();
}
</script>

<template>
  <div class="dashboard">
    <RenderAIContent 
      :response="response"
      @block-action="handleAction"
    />
  </div>
</template>`
  },
  {
    name: "LangChain Agent",
    path: "examples/langchain-agent",
    desc: "AI agent with tool use that renders UI blocks. Shows integration with LangChain's tool calling.",
    icon: Bot,
    tags: ["LangChain", "Agent", "Tools"],
    code: `import { ChatOpenAI } from '@langchain/openai';
import { 
  getDefaultRegistry, 
  registryToOpenAITools,
  normalizeLLMResponse 
} from '@mcp-interactive-ui/core';

const registry = getDefaultRegistry();
const model = new ChatOpenAI({
  modelName: 'gpt-4o-mini',
}).bind({
  tools: registryToOpenAITools(registry)
});

// Agent automatically uses UI blocks when responding
const response = await model.invoke([
  ['system', 'Use UI blocks to display data when helpful'],
  ['user', 'Show me sales data for Q4']
]);

const normalized = normalizeLLMResponse(response, registry);`
  },
  {
    name: "Node API",
    path: "examples/node-api",
    desc: "Express API that generates UI blocks from LLM responses. Backend-only example without frontend.",
    icon: Server,
    tags: ["Node.js", "Express", "API"],
    code: `import express from 'express';
import OpenAI from 'openai';
import { 
  getDefaultRegistry,
  registryToOpenAITools,
  normalizeLLMResponse 
} from '@mcp-interactive-ui/core';

const app = express();
const registry = getDefaultRegistry();
const openai = new OpenAI();

app.post('/chat', async (req, res) => {
  const completion = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      { role: 'system', content: 'Use UI blocks to display structured data' },
      { role: 'user', content: req.body.message }
    ],
    tools: registryToOpenAITools(registry)
  });

  const normalized = normalizeLLMResponse({
    text: completion.choices[0].message.content,
    blocks: completion.choices[0].message.tool_calls,
    messageId: completion.id
  }, registry);

  res.json(normalized);
});`
  }
];

export default function Examples() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Examples</h1>
        <p className="text-lg text-muted-foreground">
          Working examples showing different ways to integrate MCP Interactive UI into your applications.
        </p>
      </div>

      <div className="space-y-6">
        {examples.map((example) => {
          const Icon = example.icon
          return (
            <Card key={example.name} className="overflow-hidden">
              <CardHeader className="bg-muted/50">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6 text-primary" />
                    <div>
                      <CardTitle className="text-xl">{example.name}</CardTitle>
                      <CardDescription className="mt-1">{example.desc}</CardDescription>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {example.tags.map(tag => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="p-6">
                <Tabs defaultValue="code" className="w-full">
                  <TabsList>
                    <TabsTrigger value="code">Code</TabsTrigger>
                    <TabsTrigger value="run">
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Run Example
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="code">
                    <CodeBlock code={example.code} language="typescript" />
                  </TabsContent>
                  <TabsContent value="run">
                    <div className="flex items-center justify-center py-12 text-muted-foreground">
                      <p>Run this example locally: <code className="mx-2">pnpm --filter {example.path} dev</code></p>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Claude Desktop Config */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Claude Desktop via MCP</h2>
        <p className="text-muted-foreground">
          Configure Claude Desktop to use MCP Interactive UI as an MCP server:
        </p>
        <CodeBlock 
          code={`{
  "mcpServers": {
    "mcp-interactive-ui": {
      "command": "npx",
      "args": ["-y", "@mcp-interactive-ui/server"]
    }
  }
}`}
          language="json"
          filename="claude_desktop_config.json"
        />
        <p className="text-sm text-muted-foreground">
          Two tools appear: <code>get_available_ui_blocks</code> and <code>render_ui_block</code>
        </p>
      </section>
    </div>
  )
}
