import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CodeBlock } from "./CodeBlock";
import * as LucideIcons from "lucide-react";
import type { PackageMeta } from "@/data/packages";

interface PackageShowcaseProps {
  pkg: PackageMeta;
}

const colorMap: Record<string, string> = {
  blue: "bg-blue-500/10 text-blue-600 dark:text-blue-400",
  emerald: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
  cyan: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400",
  green: "bg-green-500/10 text-green-600 dark:text-green-400",
  purple: "bg-purple-500/10 text-purple-600 dark:text-purple-400",
  orange: "bg-orange-500/10 text-orange-600 dark:text-orange-400",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
  pink: "bg-pink-500/10 text-pink-600 dark:text-pink-400",
};

export function PackageShowcase({ pkg }: PackageShowcaseProps) {
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[pkg.icon] || LucideIcons.Box;
  const iconColor = colorMap[pkg.color] || colorMap.blue;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-xl ${iconColor}`}>
          <IconComponent className="h-8 w-8" />
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">{pkg.name}</h1>
          <p className="text-muted-foreground mt-2 text-lg">{pkg.description}</p>
        </div>
      </div>

      {/* Install Command */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <CodeBlock code={pkg.install} language="bash" />
        </CardContent>
      </Card>

      {/* When to Use */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">When to Use</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {pkg.whenToUse.map((use, i) => (
              <li key={i} className="flex items-start gap-2">
                <LucideIcons.Check className="h-4 w-4 text-green-500 mt-1 shrink-0" />
                <span>{use}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Main Tabs */}
      <Tabs defaultValue="quickstart" className="w-full">
        <TabsList className="grid w-full grid-cols-6 max-w-3xl">
          <TabsTrigger value="quickstart">Quick Start</TabsTrigger>
          <TabsTrigger value="concepts">Concepts</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="examples">Examples</TabsTrigger>
          <TabsTrigger value="typescript">TypeScript</TabsTrigger>
          <TabsTrigger value="troubleshooting">Help</TabsTrigger>
        </TabsList>

        {/* Quick Start */}
        <TabsContent value="quickstart">
          <Card>
            <CardHeader>
              <CardTitle>{pkg.quickStart.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <CodeBlock code={pkg.quickStart.code} language="typescript" />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Concepts */}
        <TabsContent value="concepts" className="space-y-4">
          {pkg.concepts.map((concept, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{concept.title}</CardTitle>
                <CardDescription>{concept.description}</CardDescription>
              </CardHeader>
              {concept.code && (
                <CardContent>
                  <CodeBlock code={concept.code} language="typescript" />
                </CardContent>
              )}
            </Card>
          ))}
        </TabsContent>

        {/* API Reference */}
        <TabsContent value="api">
          <Card>
            <CardHeader>
              <CardTitle>Exports</CardTitle>
              <CardDescription>
                All public exports from this package
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.exports.map((exp, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <code className="text-primary font-mono text-sm">{exp.name}</code>
                    <Badge variant="outline" className="text-xs">{exp.type}</Badge>
                  </div>
                  <code className="block text-xs text-muted-foreground font-mono mb-2">
                    {exp.signature}
                  </code>
                  <p className="text-sm text-muted-foreground">{exp.description}</p>
                  {exp.example && (
                    <div className="mt-2">
                      <CodeBlock code={exp.example} language="typescript" />
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Examples */}
        <TabsContent value="examples" className="space-y-4">
          {pkg.examples.map((example, i) => (
            <Card key={i}>
              <CardHeader>
                <CardTitle className="text-lg">{example.title}</CardTitle>
                <CardDescription>{example.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <CodeBlock code={example.code} language="typescript" />
              </CardContent>
            </Card>
          ))}
        </TabsContent>

        {/* TypeScript */}
        <TabsContent value="typescript">
          <Card>
            <CardHeader>
              <CardTitle>TypeScript Guide</CardTitle>
              <CardDescription>{pkg.typescript.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.typescript.generics && pkg.typescript.generics.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">Generics</h4>
                  <ul className="space-y-2">
                    {pkg.typescript.generics.map((g, i) => (
                      <li key={i} className="text-sm">
                        <code className="text-primary font-mono">{g.name}</code>
                        {g.constraint && <span className="text-muted-foreground"> extends {g.constraint}</span>}
                        <p className="text-muted-foreground mt-1">{g.description}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div>
                <h4 className="font-semibold mb-2">Tips</h4>
                <ul className="space-y-2">
                  {pkg.typescript.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <LucideIcons.Lightbulb className="h-4 w-4 text-amber-500 mt-0.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Troubleshooting */}
        <TabsContent value="troubleshooting">
          <Card>
            <CardHeader>
              <CardTitle>Troubleshooting</CardTitle>
              <CardDescription>
                Common issues and solutions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {pkg.troubleshooting.map((item, i) => (
                <div key={i} className="border rounded-lg p-4">
                  <div className="flex items-start gap-2 mb-2">
                    <LucideIcons.AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                    <span className="font-medium">{item.problem}</span>
                  </div>
                  <div className="flex items-start gap-2 pl-7">
                    <LucideIcons.CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item.solution}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
