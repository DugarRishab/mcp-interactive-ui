import { BlockCard } from "@/components/BlockCard"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { blocksMeta, blockCategories, getBlocksByCategory, categoryOrder } from "@/data/blocks"

export default function Blocks() {
  const allBlocks = Object.values(blocksMeta)
  const sortedCategories = [...blockCategories].sort((a, b) => categoryOrder[a] - categoryOrder[b])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-4xl font-bold tracking-tight">Block Components</h1>
          <Badge variant="secondary" className="text-sm">{allBlocks.length} blocks</Badge>
        </div>
        <p className="text-lg text-muted-foreground max-w-3xl">
          A comprehensive catalog of 25 schema-validated UI blocks that LLMs can reliably generate. 
          Each block includes React and Vue implementations with TypeScript support, live demos, and copy-paste examples.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="flex-wrap h-auto gap-1">
          <TabsTrigger value="all">All Blocks</TabsTrigger>
          {sortedCategories.map(category => (
            <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
          ))}
        </TabsList>

        {/* All Blocks */}
        <TabsContent value="all" className="mt-6">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {allBlocks.map(block => (
              <BlockCard key={block.id} block={block} />
            ))}
          </div>
        </TabsContent>

        {/* Category Views */}
        {sortedCategories.map(category => {
          const categoryBlocks = getBlocksByCategory(category)
          return (
            <TabsContent key={category} value={category} className="mt-6">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-semibold">{category}</h2>
                  <Badge variant="secondary">{categoryBlocks.length} blocks</Badge>
                </div>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {categoryBlocks.map(block => (
                    <BlockCard key={block.id} block={block} />
                  ))}
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>

      {/* Phase Info */}
      <section className="grid gap-6 sm:grid-cols-3">
        <div className="rounded-lg border p-4 bg-blue-500/5">
          <h3 className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Phase 1: Data Display</h3>
          <p className="text-sm text-muted-foreground">
            Read-only blocks for presenting information. Includes tables, cards, stats, notices, and markdown.
          </p>
        </div>
        <div className="rounded-lg border p-4 bg-green-500/5">
          <h3 className="font-semibold text-green-600 dark:text-green-400 mb-2">Phase 2: Interactive</h3>
          <p className="text-sm text-muted-foreground">
            User-interactive blocks like forms, buttons, tabs, modals, progress, and charts.
          </p>
        </div>
        <div className="rounded-lg border p-4 bg-purple-500/5">
          <h3 className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Phase 3: Advanced</h3>
          <p className="text-sm text-muted-foreground">
            Complex blocks including kanban, tree, gallery, timeline, diff viewer, and JSON viewer.
          </p>
        </div>
      </section>

      {/* Custom Blocks Guide */}
      <section className="space-y-4 border rounded-lg p-6 bg-muted/50">
        <h2 className="text-xl font-semibold">Adding Custom Blocks</h2>
        <p className="text-muted-foreground">
          Extend the registry with your own block types. Follow these steps:
        </p>
        <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
          <li>Add the Zod schema in <code className="text-primary">packages/types/src/blocks/&lt;name&gt;.ts</code></li>
          <li>Export from <code className="text-primary">packages/types/src/blocks/index.ts</code></li>
          <li>Add a <code className="text-primary">BlockDefinition</code> in <code className="text-primary">packages/core/src/registry/blocks/&lt;name&gt;.ts</code></li>
          <li>Add a React component in <code className="text-primary">packages/react/src/blocks/&lt;Name&gt;Block.tsx</code></li>
          <li>Register in <code className="text-primary">packages/react/src/registry.tsx</code></li>
          <li>Add Vue component in <code className="text-primary">packages/vue/src/components/blocks/&lt;Name&gt;Block.vue</code></li>
          <li>Export from <code className="text-primary">packages/vue/src/index.ts</code></li>
          <li>Document and add tests</li>
        </ol>
      </section>
    </div>
  )
}
