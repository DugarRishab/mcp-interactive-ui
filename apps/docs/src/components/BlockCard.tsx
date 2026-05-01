import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import * as LucideIcons from "lucide-react";
import type { BlockMeta, BlockCategory } from "@/data/blocks";

interface BlockCardProps {
  block: BlockMeta;
}

const categoryColors: Record<BlockCategory, string> = {
  "Data Display": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "Interactive": "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20",
  "Content": "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  "Navigation": "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20",
  "Advanced": "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20",
};

export function BlockCard({ block }: BlockCardProps) {
  const navigate = useNavigate();

  // Dynamically get the icon component
  const IconComponent = (LucideIcons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[block.icon] || LucideIcons.Box;

  return (
    <Card
      className="group cursor-pointer transition-all duration-200 hover:shadow-md hover:border-primary/50"
      onClick={() => navigate(`/blocks/${block.id}`)}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className={`p-2 rounded-lg ${categoryColors[block.category]}`}>
            <IconComponent className="h-5 w-5" />
          </div>
          <div className="flex gap-1">
            <Badge variant="secondary" className="text-xs">
              Phase {block.phase}
            </Badge>
          </div>
        </div>
        <CardTitle className="text-lg mt-3 group-hover:text-primary transition-colors">
          {block.name}
        </CardTitle>
        <CardDescription className="line-clamp-2 text-sm">
          {block.description}
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1">
          <Badge variant="outline" className={`text-xs ${categoryColors[block.category]}`}>
            {block.category}
          </Badge>
        </div>
        <div className="mt-3 flex items-center text-xs text-muted-foreground">
          <span>{block.features.length} features</span>
          <span className="mx-2">•</span>
          <span className="group-hover:text-primary transition-colors">
            View details →
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
