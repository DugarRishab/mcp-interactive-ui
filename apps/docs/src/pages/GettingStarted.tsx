import { NavLink } from "react-router-dom";
import { CodeBlock } from "@/components/CodeBlock"
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal, Info, Package, Layout, Database, Shield } from "lucide-react"

export default function GettingStarted() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Getting Started</h1>
        <p className="text-lg text-muted-foreground">
          Learn how to install MCP Interactive UI and start building rich, interactive AI experiences.
        </p>
      </div>

      <Alert>
        <Info className="h-4 w-4" />
        <AlertTitle>Prerequisites</AlertTitle>
        <AlertDescription>
          Your app must have Tailwind CSS configured with shadcn/ui design tokens. 
          Run <code>npx shadcn@latest init</code> if you haven't already.
        </AlertDescription>
      </Alert>

      {/* Installation */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Terminal className="h-5 w-5" />
          Installation
        </h2>
        <p className="text-muted-foreground">
          Install the packages for your framework. All packages require the core package as a peer dependency.
        </p>

        <Tabs defaultValue="react" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="vue">Vue</TabsTrigger>
            <TabsTrigger value="node">Node.js</TabsTrigger>
          </TabsList>
          <TabsContent value="react" className="space-y-4">
            <CodeBlock 
              code="npm install @mcp-interactive-ui/react @mcp-interactive-ui/core" 
              language="bash"
            />
            <p className="text-sm text-muted-foreground">
              React 18+ and Tailwind CSS with shadcn/ui tokens required.
            </p>
          </TabsContent>
          <TabsContent value="vue" className="space-y-4">
            <CodeBlock 
              code="npm install @mcp-interactive-ui/vue @mcp-interactive-ui/core" 
              language="bash"
            />
            <p className="text-sm text-muted-foreground">
              Vue 3+ and Tailwind CSS with shadcn/ui tokens required.
            </p>
          </TabsContent>
          <TabsContent value="node" className="space-y-4">
            <CodeBlock 
              code="npm install @mcp-interactive-ui/core" 
              language="bash"
            />
            <p className="text-sm text-muted-foreground">
              For backend/API usage without UI components.
            </p>
          </TabsContent>
        </Tabs>
      </section>

      {/* Core Concepts */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Layout className="h-5 w-5" />
          Core Concepts
        </h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <Database className="h-5 w-5 text-primary mb-2" />
              <CardTitle>Block Registry</CardTitle>
              <CardDescription>
                The registry holds all valid block types with their Zod schemas. 
                The LLM can only emit blocks that are registered.
              </CardDescription>
            </CardHeader>
          </Card>
          <Card>
            <CardHeader>
              <Shield className="h-5 w-5 text-primary mb-2" />
              <CardTitle>Normalization</CardTitle>
              <CardDescription>
                Every LLM response is validated and normalized. Invalid or unknown blocks 
                become warning notices automatically.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </section>

      {/* Quick Start */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold flex items-center gap-2">
          <Package className="h-5 w-5" />
          Quick Start
        </h2>
        <p className="text-muted-foreground">
          Here's a minimal example to get you started with React:
        </p>
        
        <CodeBlock 
          code={`import { RenderAIContent } from '@mcp-interactive-ui/react';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';

interface ChatMessageProps {
  response: NormalizedAIResponse;
}

export function ChatMessage({ response }: ChatMessageProps) {
  return (
    <RenderAIContent
      response={response}
      onBlockAction={(action, payload) => {
        console.log('User action:', action, payload);
      }}
    />
  );
}`}
          language="tsx"
          filename="ChatMessage.tsx"
        />
      </section>

      {/* Response Format */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Response Format</h2>
        <p className="text-muted-foreground">
          The LLM returns a normalized response with text and blocks. Each block has a type, 
          unique id, and data matching its Zod schema.
        </p>
        
        <CodeBlock 
          code={`{
  "text": "Your order summary:",
  "blocks": [
    {
      "type": "data_table",
      "id": "order-table",
      "data": {
        "columns": [
          { "key": "item", "header": "Item", "type": "text" },
          { "key": "price", "header": "Price", "type": "currency" }
        ],
        "rows": [
          { "item": "Widget", "price": "$19.99" },
          { "item": "Gadget", "price": "$29.99" }
        ],
        "caption": "Order #12345"
      }
    },
    {
      "type": "stat_group",
      "id": "order-stats",
      "data": {
        "items": [
          { "label": "Subtotal", "value": "$49.98" },
          { "label": "Tax", "value": "$4.50" },
          { "label": "Total", "value": "$54.48" }
        ]
      }
    }
  ],
  "messageId": "msg_123",
  "metadata": { "model": "gpt-4o-mini" }
}`}
          language="json"
          filename="llm-response.json"
        />
      </section>

      {/* Next Steps */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Next Steps</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <NavLink to="/blocks">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">View Blocks</CardTitle>
                <CardDescription>
                  Explore the 25+ available block types and their schemas.
                </CardDescription>
              </CardHeader>
            </Card>
          </NavLink>
          <NavLink to="/examples">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">Examples</CardTitle>
                <CardDescription>
                  See working examples for React, Vue, and Node.js.
                </CardDescription>
              </CardHeader>
            </Card>
          </NavLink>
          <NavLink to="/api">
            <Card className="hover:border-primary transition-colors cursor-pointer h-full">
              <CardHeader>
                <CardTitle className="text-lg">API Reference</CardTitle>
                <CardDescription>
                  Deep dive into all packages and their exports.
                </CardDescription>
              </CardHeader>
            </Card>
          </NavLink>
        </div>
      </section>
    </div>
  )
}
