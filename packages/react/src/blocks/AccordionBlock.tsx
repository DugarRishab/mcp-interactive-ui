import { useState, useCallback } from 'react';
import type { AccordionData, AccordionItemWithContent } from '@mcp-interactive-ui/types';
import { NestedBlockRenderer } from '../components/NestedBlockRenderer.js';

export interface AccordionBlockProps {
  data: AccordionData & { items?: AccordionItemWithContent[] };
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

/**
 * Renders an `accordion` block with shadcn/ui styling.
 * Supports single/multiple expansion modes and nested content.
 */
export function AccordionBlock({ data, className, blockId, onAction }: AccordionBlockProps): JSX.Element {
  const type = data.type ?? 'single';
  const collapsible = data.collapsible ?? true;
  const accordionId = blockId ?? `accordion-${Math.random().toString(36).substr(2, 9)}`;

  // Initialize open items
  const initialOpenItems = new Set<string>();
  data.items?.forEach((item) => {
    if (item.defaultOpen) {
      initialOpenItems.add(item.id);
    }
  });

  const [openItems, setOpenItems] = useState<Set<string>>(initialOpenItems);

  const handleToggle = useCallback((itemId: string) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev);
      const isOpen = newSet.has(itemId);

      if (type === 'single') {
        // In single mode, close all others
        newSet.clear();
        if (!isOpen || collapsible) {
          newSet.add(itemId);
        }
      } else {
        // In multiple mode, toggle individual items
        if (isOpen) {
          if (collapsible) {
            newSet.delete(itemId);
          }
        } else {
          newSet.add(itemId);
        }
      }

      // Emit action
      onAction?.('section_toggle', {
        itemId,
        isOpen: !isOpen,
        timestamp: Date.now(),
      });

      return newSet;
    });
  }, [type, collapsible, onAction]);

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'} role="presentation">
      {/* Title and description */}
      {(data.title || data.description) && (
        <div className="p-6 pb-4 space-y-1">
          {data.title && <h3 className="text-lg font-semibold">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      {/* Accordion items */}
      <div className={data.title || data.description ? 'px-6 pb-6' : 'p-6'}>
        {data.items?.map((item, index) => {
          const isOpen = openItems.has(item.id);
          const itemContent = (item as AccordionItemWithContent).content;

          return (
            <div
              key={item.id}
              className={`
                border-b last:border-b-0
                ${index === 0 ? 'border-t' : ''}
              `}
            >
              {/* Accordion Trigger */}
              <button
                type="button"
                id={`${accordionId}-trigger-${item.id}`}
                aria-expanded={isOpen}
                aria-controls={`${accordionId}-content-${item.id}`}
                aria-disabled={item.disabled}
                onClick={() => !item.disabled && handleToggle(item.id)}
                disabled={item.disabled}
                className={`
                  flex flex-1 items-center justify-between py-4 font-medium transition-all
                  hover:underline
                  ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}
                  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                `}
              >
                <div className="flex items-center gap-2">
                  {item.icon && <span>{item.icon}</span>}
                  <div className="text-left">
                    <div>{item.title}</div>
                    {item.subtitle && (
                      <div className="text-sm text-muted-foreground">{item.subtitle}</div>
                    )}
                  </div>
                </div>

                {/* Chevron icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className={`h-4 w-4 shrink-0 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              {/* Accordion Content */}
              <div
                id={`${accordionId}-content-${item.id}`}
                role="region"
                aria-labelledby={`${accordionId}-trigger-${item.id}`}
                aria-hidden={!isOpen}
                className={`
                  overflow-hidden transition-all
                  ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}
                `}
              >
                <div className="pb-4 pt-0">
                  {itemContent && itemContent.length > 0 ? (
                    <NestedBlockRenderer
                      blocks={itemContent}
                      onBlockAction={(id, type, action, payload) => onAction?.(action, payload)}
                      depth={1}
                    />
                  ) : (
                    <div className="text-muted-foreground text-sm">
                      Content for "{item.title}"
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
