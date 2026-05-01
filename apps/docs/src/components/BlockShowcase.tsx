import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";
import * as LucideIcons from "lucide-react";
import type { BlockMeta } from "@/data/blocks";

// Import all React block components
import {
  DataTableBlock,
  KVCardBlock,
  StatGroupBlock,
  NoticeBlock,
  MarkdownBlock,
  FormInputBlock,
  ButtonGroupBlock,
  TabsBlock,
  AccordionBlock,
  ModalBlock,
  ProgressBlock,
  ChartBlock,
  CodeBlock as CodeBlockComponent,
  TimelineBlock,
  GalleryBlock,
  ListBlock,
  BreadcrumbBlock,
  BadgeGroupBlock,
  MetricCardBlock,
  ComparisonTableBlock,
  JsonViewerBlock,
  DiffViewerBlock,
  KanbanBlock,
  TreeBlock,
  CarouselBlock,
} from "@mcp-interactive-ui/react";

interface BlockShowcaseProps {
  block: BlockMeta;
}

const blockComponents: Record<string, React.ComponentType<{ data: unknown; onAction?: (action: string, payload?: unknown) => void }>> = {
  data_table: DataTableBlock,
  kv_card: KVCardBlock,
  stat_group: StatGroupBlock,
  notice: NoticeBlock,
  markdown: MarkdownBlock,
  form_input: FormInputBlock,
  button_group: ButtonGroupBlock,
  tabs: TabsBlock,
  accordion: AccordionBlock,
  modal: ModalBlock,
  progress: ProgressBlock,
  chart: ChartBlock,
  code: CodeBlockComponent,
  timeline: TimelineBlock,
  gallery: GalleryBlock,
  list: ListBlock,
  breadcrumb: BreadcrumbBlock,
  badge_group: BadgeGroupBlock,
  metric_card: MetricCardBlock,
  comparison_table: ComparisonTableBlock,
  json_viewer: JsonViewerBlock,
  diff_viewer: DiffViewerBlock,
  kanban: KanbanBlock,
  tree: TreeBlock,
  carousel: CarouselBlock,
};

const categoryLabels: Record<string, string> = {
  "Data Display": "📊 Data Display",
  "Interactive": "🎮 Interactive",
  "Content": "📝 Content",
  "Navigation": "🧭 Navigation",
  "Advanced": "🚀 Advanced",
};

export function BlockShowcase({ block }: BlockShowcaseProps) {
  const [activeTab, setActiveTab] = useState("preview");
  const BlockComponent = blockComponents[block.id];
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[block.icon] || LucideIcons.Box;

  const handleAction = (action: string, payload?: unknown) => {
    console.log(`Block action: ${action}`, payload);
    // eslint-disable-next-line no-alert
    alert(`Action triggered: ${action}\nPayload: ${JSON.stringify(payload, null, 2)}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className="p-3 rounded-xl bg-primary/10">
          <IconComponent className="h-8 w-8 text-primary" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-3xl font-bold">{block.name}</h1>
            <Badge variant="secondary">Phase {block.phase}</Badge>
            <Badge variant="outline">{categoryLabels[block.category]}</Badge>
          </div>
          <p className="text-muted-foreground mt-2 text-lg">{block.description}</p>
        </div>
      </div>

      {/* Main Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5 max-w-2xl">
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="schema">Schema</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="props">Props</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
        </TabsList>

        {/* Preview Tab */}
        <TabsContent value="preview" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Live Demo</CardTitle>
              <CardDescription>
                Interactive demonstration with sample data
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6 border rounded-lg bg-background">
              {BlockComponent ? (
                <BlockComponent data={block.sampleData} onAction={handleAction} />
              ) : (
                <div className="text-muted-foreground">Component not available</div>
              )}
            </CardContent>
          </Card>

          {/* Features */}
          <Card>
            <CardHeader>
              <CardTitle>Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {block.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <LucideIcons.Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          {/* Use Cases */}
          <Card>
            <CardHeader>
              <CardTitle>When to Use</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {block.useCases.map((useCase, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <LucideIcons.Lightbulb className="h-4 w-4 text-amber-500 mt-1 shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Schema Tab */}
        <TabsContent value="schema">
          <Card>
            <CardHeader>
              <CardTitle>Zod Schema</CardTitle>
              <CardDescription>
                Runtime validation schema for this block type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock
                code={`import { ${block.id.replace(/_/g, "")}DataSchema } from '@mcp-interactive-ui/types';

// Validate data at runtime
const result = ${block.id.replace(/_/g, "")}DataSchema.safeParse(data);

if (result.success) {
  console.log("Valid block data:", result.data);
} else {
  console.error("Validation errors:", result.error.issues);
}`}
                language="typescript"
              />
              <div className="mt-4">
                <h4 className="font-semibold mb-2">Type Definition:</h4>
                <CodeBlock
                  code={`export type ${block.name.replace(/\s+/g, "")}Data = z.infer<typeof ${block.id.replace(/_/g, "")}DataSchema>;`}
                  language="typescript"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples Tab */}
        <TabsContent value="examples" className="space-y-4">
          {block.examples.map((example, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle>{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={example.code} language="tsx" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* Props Tab */}
        <TabsContent value="props">
          <Card>
            <CardHeader>
              <CardTitle>Component Props</CardTitle>
              <CardDescription>
                Available props for the React component
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-2 px-4 font-medium">Name</th>
                      <th className="text-left py-2 px-4 font-medium">Type</th>
                      <th className="text-left py-2 px-4 font-medium">Required</th>
                      <th className="text-left py-2 px-4 font-medium">Default</th>
                      <th className="text-left py-2 px-4 font-medium">Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {block.props.map((prop, i) => (
                      <tr key={i} className="border-b last:border-0">
                        <td className="py-2 px-4 font-mono text-primary">{prop.name}</td>
                        <td className="py-2 px-4 font-mono text-xs">{prop.type}</td>
                        <td className="py-2 px-4">
                          {prop.required ? (
                            <Badge variant="destructive" className="text-xs">Required</Badge>
                          ) : (
                            <Badge variant="secondary" className="text-xs">Optional</Badge>
                          )}
                        </td>
                        <td className="py-2 px-4 text-muted-foreground text-xs">
                          {prop.default || "—"}
                        </td>
                        <td className="py-2 px-4 text-muted-foreground">{prop.description}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* JSON Tab */}
        <TabsContent value="json">
          <Card>
            <CardHeader>
              <CardTitle>Sample JSON</CardTitle>
              <CardDescription>
                Example LLM response for this block type
              </CardDescription>
            </CardHeader>
            <CardContent>
              <CodeBlock code={block.sampleJson} language="json" />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
