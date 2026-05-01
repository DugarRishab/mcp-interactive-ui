import { NavLink } from "react-router-dom"
import { ArrowRight, Blocks, Shield, Zap, Table, FileText, Bell, Package } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CodeBlock } from "@/components/CodeBlock"

export default function Home() {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-16 md:py-24">
        <Badge variant="secondary" className="mb-4">
          Phase 1 Released
        </Badge>
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
          shadcn, but for{' '}
          <span className="text-primary">LLM outputs</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-8">
          A transport-agnostic TypeScript library that lets an LLM emit strictly-typed, 
          schema-validated UI blocks backed by shadcn/ui.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Button size="lg">
            <NavLink to="/getting-started" className="flex items-center">
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </NavLink>
          </Button>
          <Button variant="outline" size="lg">
            <NavLink to="/blocks">View Components</NavLink>
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <Shield className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Schema-First Safety</CardTitle>
            <CardDescription>
              Every block has a Zod schema the LLM cannot escape. Unknown or invalid blocks 
              automatically become warning notices.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Blocks className="h-8 w-8 text-primary mb-2" />
            <CardTitle>25+ Block Types</CardTitle>
            <CardDescription>
              From data tables to kanban boards. Interactive blocks for forms, charts, 
              timelines, and more.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Zap className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Transport Agnostic</CardTitle>
            <CardDescription>
              Works with OpenAI, Claude Desktop (MCP), LangChain, or any HTTP transport. 
              The UI doesn't care where the data comes from.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Package className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Modular Packages</CardTitle>
            <CardDescription>
              Core registry has no dependencies. React components are pure dispatchers. 
              Use only what you need.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <Table className="h-8 w-8 text-primary mb-2" />
            <CardTitle>shadcn/ui Backed</CardTitle>
            <CardDescription>
              All components use shadcn/ui design tokens. Fits seamlessly into any 
              shadcn-based application.
            </CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader>
            <FileText className="h-8 w-8 text-primary mb-2" />
            <CardTitle>Full TypeScript</CardTitle>
            <CardDescription>
              End-to-end type safety from Zod schemas to React props. Never guess what 
              fields a block contains.
            </CardDescription>
          </CardHeader>
        </Card>
      </section>

      {/* Quick Start */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Quick Start</h2>
          <p className="text-muted-foreground">
            Install the packages and start rendering AI content in minutes.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="font-semibold">1. Install Packages</h3>
            <CodeBlock 
              code="npm install @mcp-interactive-ui/react @mcp-interactive-ui/core" 
              language="bash"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">2. Render AI Content</h3>
            <CodeBlock 
              code={`import { RenderAIContent } from '@mcp-interactive-ui/react';

function ChatMessage({ response }) {
  return (
    <RenderAIContent
      response={response}
      onBlockAction={(action, payload) => {
        console.log('Action:', action, payload);
      }}
    />
  );
}`} 
              language="tsx"
              filename="ChatMessage.tsx"
            />
          </div>
        </div>
      </section>

      {/* Phase 1 Blocks Preview */}
      <section className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-2">Phase 1 Block Catalog</h2>
          <p className="text-muted-foreground">
            Five read-only block types with full schema validation.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            { name: "data_table", icon: Table, desc: "Tabular data up to 20 columns, 500 rows" },
            { name: "kv_card", icon: FileText, desc: "Single record with up to 30 fields" },
            { name: "stat_group", icon: Zap, desc: "1-8 KPI tiles with deltas" },
            { name: "notice", icon: Bell, desc: "Info/success/warning/error banners" },
            { name: "markdown", icon: FileText, desc: "Sanitized GFM up to 10k chars" },
          ].map((block) => {
            const Icon = block.icon
            return (
              <Card key={block.name} className="hover:border-primary transition-colors">
                <CardContent className="p-4">
                  <Icon className="h-6 w-6 text-primary mb-2" />
                  <code className="text-sm font-medium">{block.name}</code>
                  <p className="text-xs text-muted-foreground mt-1">{block.desc}</p>
                </CardContent>
              </Card>
            )
          })}
        </div>
        
        <div className="text-center">
          <Button variant="outline">
            <NavLink to="/blocks">View All Blocks</NavLink>
          </Button>
        </div>
      </section>

      {/* CTA */}
      <section className="border rounded-2xl p-8 md:p-12 text-center bg-muted/50">
        <h2 className="text-2xl md:text-3xl font-bold mb-4">
          Ready to transform your AI interactions?
        </h2>
        <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
          Start building rich, interactive AI experiences with schema-validated UI blocks 
          that your LLM can reliably generate.
        </p>
        <Button size="lg">
          <NavLink to="/getting-started" className="flex items-center">
            Get Started
            <ArrowRight className="ml-2 h-4 w-4" />
          </NavLink>
        </Button>
      </section>
    </div>
  )
}
