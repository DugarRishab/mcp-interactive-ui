import { useParams, Navigate } from "react-router-dom";
import { BlockShowcase } from "@/components/BlockShowcase";
import { blocksMeta } from "@/data/blocks";
import type { BlockType } from "@mcp-interactive-ui/types";

export default function BlockDetail() {
  const { blockId } = useParams<{ blockId: string }>();

  if (!blockId || !(blockId in blocksMeta)) {
    return <Navigate to="/blocks" replace />;
  }

  const block = blocksMeta[blockId as BlockType];

  return (
    <div className="container py-6 max-w-5xl">
      <BlockShowcase block={block} />
    </div>
  );
}
