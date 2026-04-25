import { useState, useCallback, useEffect } from 'react';
import type { TabsData, TabItemWithContent } from '@mcp-interactive-ui/types';
import { NestedBlockRenderer } from '../components/NestedBlockRenderer.js';

export interface TabsBlockProps {
  data: TabsData & { tabs?: TabItemWithContent[] };
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

/**
 * Renders a `tabs` block with shadcn/ui styling.
 * Supports horizontal/vertical orientation, multiple variants, and nested content.
 */
export function TabsBlock({ data, className, blockId, onAction }: TabsBlockProps): JSX.Element {
  const [activeTab, setActiveTab] = useState(data.defaultTab ?? data.tabs?.[0]?.id ?? '');

  // Load persisted state from localStorage if enabled
  useEffect(() => {
    if (data.persistState && blockId) {
      const saved = localStorage.getItem(`tabs-${blockId}`);
      if (saved) {
        setActiveTab(saved);
      }
    }
  }, [blockId, data.persistState]);

  // Persist state when tab changes
  useEffect(() => {
    if (data.persistState && blockId) {
      localStorage.setItem(`tabs-${blockId}`, activeTab);
    }
  }, [activeTab, blockId, data.persistState]);

  const handleTabChange = useCallback((tabId: string) => {
    if (tabId === activeTab) return;

    const fromTabId = activeTab;
    setActiveTab(tabId);

    onAction?.('tab_change', {
      fromTabId,
      toTabId: tabId,
      timestamp: Date.now(),
    });
  }, [activeTab, onAction]);

  const variant = data.variant ?? 'default';
  const orientation = data.orientation ?? 'horizontal';

  // Tab trigger styles based on variant
  const getTriggerStyles = (isActive: boolean, isDisabled?: boolean) => {
    const baseStyles = `
      inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium
      ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
      disabled:pointer-events-none disabled:opacity-50
    `;

    if (isDisabled) {
      return `${baseStyles} cursor-not-allowed opacity-50`;
    }

    if (variant === 'default') {
      return `${baseStyles} ${
        isActive
          ? 'bg-background text-foreground shadow-sm'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`;
    }

    if (variant === 'outline') {
      return `${baseStyles} border ${
        isActive
          ? 'border-foreground bg-foreground text-background'
          : 'border-input bg-background hover:bg-accent hover:text-accent-foreground'
      }`;
    }

    if (variant === 'pills') {
      return `${baseStyles} rounded-full ${
        isActive
          ? 'bg-primary text-primary-foreground'
          : 'text-muted-foreground hover:bg-muted hover:text-foreground'
      }`;
    }

    return baseStyles;
  };

  const isVertical = orientation === 'vertical';

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {/* Title */}
      {data.title && (
        <div className="p-6 pb-0">
          <h3 className="text-lg font-semibold">{data.title}</h3>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className={`${isVertical ? 'flex' : ''} ${data.title ? 'pt-4' : ''}`}>
        <div
          className={`
            ${isVertical ? 'flex-col border-r pr-4' : 'border-b'}
            ${isVertical ? 'w-48 shrink-0' : ''}
          `}
        >
          <div
            className={`
              ${isVertical ? 'flex-col space-y-1' : 'inline-flex h-10 items-center justify-center rounded-md bg-muted p-1'}
              ${isVertical && variant !== 'outline' ? 'p-2' : ''}
            `}
          >
            {data.tabs?.map((tab) => (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={activeTab === tab.id}
                disabled={tab.disabled}
                onClick={() => handleTabChange(tab.id)}
                className={getTriggerStyles(activeTab === tab.id, tab.disabled)}
                title={tab.tooltip}
              >
                {tab.icon && <span className="mr-2">{tab.icon}</span>}
                {tab.label}
                {tab.badge && (
                  <span className="ml-2 inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium">
                    {tab.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className={`${isVertical ? 'flex-1 p-4' : 'p-6'}`}>
          {data.tabs?.map((tab) => {
            const isActive = activeTab === tab.id;
            const tabContent = (tab as TabItemWithContent).content;

            return (
              <div
                key={tab.id}
                role="tabpanel"
                hidden={!isActive}
                className={isActive ? 'block' : 'hidden'}
              >
                {tabContent && tabContent.length > 0 ? (
                  <NestedBlockRenderer
                    blocks={tabContent}
                    onBlockAction={(id, type, action, payload) => onAction?.(action, payload)}
                    depth={1}
                  />
                ) : (
                  <div className="text-muted-foreground text-sm">
                    Tab content for "{tab.label}"
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
