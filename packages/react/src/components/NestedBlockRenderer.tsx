import type { NormalizedBlock } from '@mcp-interactive-ui/types';
import { defaultBlockComponents, type BlockComponentMap } from '../registry.js';
import { NoticeBlock } from '../blocks/NoticeBlock.js';

export interface NestedBlockRendererProps {
  blocks: NormalizedBlock[];
  className?: string;
  onBlockAction?: (blockId: string, blockType: string, action: string, payload: unknown) => void;
  depth?: number;
  components?: Partial<BlockComponentMap>;
}

const MAX_NESTING_DEPTH = 3;

function UnknownBlock({ block }: { block: NormalizedBlock }): JSX.Element {
  return (
    <NoticeBlock
      data={{
        variant: 'warning',
        title: 'Unsupported nested block',
        message: `The renderer does not know how to display a "${block.type}" block.`,
      }}
    />
  );
}

/**
 * Renders nested blocks within container blocks (tabs, accordion, modal).
 * Enforces a maximum nesting depth to prevent infinite recursion.
 */
export function NestedBlockRenderer({
  blocks,
  className,
  onBlockAction,
  depth = 0,
  components,
}: NestedBlockRendererProps): JSX.Element {
  const registry: BlockComponentMap = { ...defaultBlockComponents, ...components } as BlockComponentMap;

  if (depth >= MAX_NESTING_DEPTH) {
    return (
      <NoticeBlock
        data={{
          variant: 'warning',
          title: 'Maximum nesting depth exceeded',
          message: 'Blocks cannot be nested more than 3 levels deep.',
        }}
      />
    );
  }

  const handleAction = (blockId: string, blockType: string, action: string, payload: unknown) => {
    onBlockAction?.(blockId, blockType, action, payload);
  };

  return (
    <div className={className ?? 'space-y-4'}>
      {blocks.map((block) => {
        const Component = registry[block.type] as
          | React.ComponentType<{
              data: unknown;
              className?: string;
              blockId?: string;
              onAction?: (action: string, payload: unknown) => void;
            }>
          | undefined;

        if (!Component) {
          return <UnknownBlock key={block.id} block={block} />;
        }

        return (
          <Component
            key={block.id}
            data={block.data}
            blockId={block.id}
            onAction={(action, payload) => handleAction(block.id, block.type, action, payload)}
          />
        );
      })}
    </div>
  );
}
