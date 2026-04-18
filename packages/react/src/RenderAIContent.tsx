import type { NormalizedAIResponse, NormalizedBlock } from '@mcp-interactive-ui/types';
import { defaultBlockComponents, type BlockComponentMap } from './registry.js';
import { MarkdownBlock } from './blocks/MarkdownBlock.js';
import { NoticeBlock } from './blocks/NoticeBlock.js';

export interface RenderAIContentProps {
  data: NormalizedAIResponse;
  className?: string;
  /**
   * Override one or more default block components. Useful for custom styling
   * or swapping in app-specific shadcn variants.
   */
  components?: Partial<BlockComponentMap>;
  /**
   * Called (in dev) when a block's type is unknown to the renderer. In
   * production the fallback notice is silently rendered.
   */
  onUnknownBlock?: (block: NormalizedBlock) => void;
}

function UnknownBlock({ block }: { block: NormalizedBlock }): JSX.Element {
  return (
    <NoticeBlock
      data={{
        variant: 'warning',
        title: 'Unsupported block',
        message: `The renderer does not know how to display a "${block.type}" block.`,
      }}
    />
  );
}

/**
 * Render a `NormalizedAIResponse` as a sequence of safe, typed UI blocks.
 *
 * This is a pure dispatcher:
 *   - No network calls.
 *   - No inference from labels or strings.
 *   - `block.type` is the sole routing key.
 */
export function RenderAIContent({
  data,
  className,
  components,
  onUnknownBlock,
}: RenderAIContentProps): JSX.Element {
  const registry: BlockComponentMap = { ...defaultBlockComponents, ...components };

  return (
    <div className={className ?? 'space-y-4'}>
      {data.text ? (
        <MarkdownBlock data={{ content: data.text }} />
      ) : null}

      {data.blocks.map((block) => {
        const Component = registry[block.type] as
          | React.ComponentType<{ data: unknown; className?: string }>
          | undefined;
        if (!Component) {
          onUnknownBlock?.(block);
          return <UnknownBlock key={block.id} block={block} />;
        }
        return <Component key={block.id} data={block.data} />;
      })}
    </div>
  );
}
