import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CodeBlock } from "@/components/CodeBlock"
import * as LucideIcons from "lucide-react"
import { packagesMeta, packageOrder } from "@/data/packages"

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  green: "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
};

export default function Api() {
  const navigate = useNavigate();
  const allPackages = packageOrder.map(id => packagesMeta[id]);

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold tracking-tight">API Reference</h1>
          <Badge variant="secondary" className="text-sm">{allPackages.length} packages</Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          Comprehensive documentation for all packages. Each package has detailed guides, 
          API reference, examples, and troubleshooting tips.
        </p>
      </div>

      {/* Package Grid */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Packages</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {allPackages.map((pkg) => {
            const Icon = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pkg.icon] || LucideIcons.Box;
            const iconColor = colorMap[pkg.color] || colorMap.blue;

            return (
              <Card
                key={pkg.id}
                className={`group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50 ${iconColor}`}
                onClick={() => navigate(`/api/${pkg.id}`)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className={`p-2 rounded-lg ${iconColor}`}>
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>
                  <CardTitle className="text-base mt-3 group-hover:text-primary transition-colors">
                    {pkg.name}
                  </CardTitle>
                  <CardDescription className="line-clamp-2 text-sm">
                    {pkg.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="text-xs text-muted-foreground group-hover:text-primary transition-colors">
                    View documentation →
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>

      {/* Decision Tree */}
      <section className="space-y-4 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-xl font-semibold">Which Package Do I Need?</h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-2">
            <h3 className="font-medium text-primary">React App</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>@mcp-interactive-ui/react</code> for pre-built components
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Vue App</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>@mcp-interactive-ui/vue</code> for Vue 3 components
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Server/API</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>@mcp-interactive-ui/core</code> for validation & OpenAI tools
            </p>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium text-primary">Custom UI</h3>
            <p className="text-sm text-muted-foreground">
              Use <code>@mcp-interactive-ui/types</code> for TypeScript types
            </p>
          </div>
        </div>
      </section>

      {/* Quick Examples */}
      <section className="space-y-4">
        <h2 className="text-2xl font-semibold">Quick Examples</h2>
        
        <Tabs defaultValue="react" className="w-full">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="react">React</TabsTrigger>
            <TabsTrigger value="openai">OpenAI</TabsTrigger>
            <TabsTrigger value="mcp">MCP Server</TabsTrigger>
          </TabsList>
          
          <TabsContent value="react" className="mt-4">
            <CodeBlock 
              code={`import { RenderAIContent } from '@mcp-interactive-ui/react';

// Basic usage
<RenderAIContent response={aiResponse} />

// With custom component overrides
<RenderAIContent 
  response={aiResponse}
  components={{
    data_table: MyCustomTable,
    stat_group: MyCustomStats
  }}
  onBlockAction={(action, payload) => {
    console.log('User interacted:', action, payload);
  }}
/>`}
              language="tsx"
            />
          </TabsContent>
          
          <TabsContent value="openai" className="mt-4">
            <CodeBlock 
              code={`import OpenAI from 'openai';
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

  const message = completion.choices[0].message;
  const rawBlocks = parseOpenAIToolCalls(message);

  return normalizeLLMResponse({
    text: message.content ?? undefined,
    blocks: rawBlocks,
    messageId: completion.id,
    metadata: { model: completion.model },
  }, registry);
}`}
              language="typescript"
            />
          </TabsContent>
          
          <TabsContent value="mcp" className="mt-4">
            <CodeBlock 
              code={`// Via npx - no installation needed
{
  "mcpServers": {
    "mcp-interactive-ui": {
      "command": "npx",
      "args": ["-y", "@mcp-interactive-ui/server"]
    }
  }
}

// Or programmatically
import { createServer } from '@mcp-interactive-ui/server';

const server = createServer({
  registry: getDefaultRegistry()
});

// Available tools:
// - get_available_ui_blocks: Returns all block schemas
// - render_ui_block: Validates and returns a block`}
              language="typescript"
            />
          </TabsContent>
        </Tabs>
      </section>
    </div>
  )
}
