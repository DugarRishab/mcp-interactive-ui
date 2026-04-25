import type { NormalizedAIResponse, NormalizedBlock, BlockAction } from '@mcp-interactive-ui/types';
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
   * Called when an interactive block emits an action (form submit, button click, etc.).
   * Use this to handle user interactions and send follow-up messages to the LLM.
   */
  onBlockAction?: (action: BlockAction) => void | Promise<void>;
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
  onBlockAction,
  onUnknownBlock,
}: RenderAIContentProps): JSX.Element {
  const registry: BlockComponentMap = { ...defaultBlockComponents, ...components } as BlockComponentMap;

  const handleBlockAction = (blockId: string, blockType: string, action: string, payload: unknown) => {
    const blockAction: BlockAction = {
      blockId,
      blockType,
      action,
      payload,
      timestamp: Date.now(),
    };
    onBlockAction?.(blockAction);
  };

  return (
    <div className={className ?? 'space-y-4 max-w-[70%] w-full'} role="main" aria-label="AI response content">
      {data.text ? (
        <div role="region" aria-label="Response text">
          <MarkdownBlock data={{ content: data.text }} />
        </div>
      ) : null}

      {data.blocks.map((block) => {
        const Component = registry[block.type] as
          | React.ComponentType<{ data: unknown; className?: string; blockId?: string; onAction?: (action: string, payload: unknown) => void }>
          | undefined;
        if (!Component) {
          onUnknownBlock?.(block);
          return <UnknownBlock key={block.id} block={block} />;
        }
        return (
          <div key={block.id} role="region" aria-label={`${block.type} block`}>
            <Component
              data={block.data}
              blockId={block.id}
              onAction={(action, payload) => handleBlockAction(block.id, block.type, action, payload)}
            />
          </div>
        );
      })}
    </div>
  );
}
