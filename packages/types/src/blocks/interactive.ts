/**
 * Interactive block action system for Phase 2.
 *
 * When users interact with form_input, button_group, tabs, accordion, modal, or progress blocks,
 * actions are emitted with this shape.
 */

export interface BlockAction {
  /** The block that emitted this action */
  blockId: string;
  /** The type of block (e.g., 'form_input', 'button_group') */
  blockType: string;
  /** The action type (e.g., 'submit', 'click', 'tab_change') */
  action: string;
  /** Action-specific payload data */
  payload: unknown;
  /** Unix timestamp when action was emitted */
  timestamp: number;
  /** Optional metadata for debugging or analytics */
  metadata?: Record<string, unknown>;
}

/**
 * Handler function type for block actions.
 * Can be synchronous or asynchronous.
 */
export type BlockActionHandler = (action: BlockAction) => void | Promise<void>;

/**
 * Result of validating a block action.
 */
export interface ValidateActionResult {
  success: boolean;
  errors?: string[];
}

import type { NormalizedBlock } from './index.js';

/**
 * Extended tab item with nested content blocks.
 * Used for blocks that can contain other blocks.
 */
export interface TabItemWithContent {
  id: string;
  label: string;
  icon?: string;
  content: NormalizedBlock[];
  disabled?: boolean;
  badge?: string;
  tooltip?: string;
}

/**
 * Extended accordion item with nested content blocks.
 */
export interface AccordionItemWithContent {
  id: string;
  title: string;
  subtitle?: string;
  content: NormalizedBlock[];
  icon?: string;
  defaultOpen?: boolean;
  disabled?: boolean;
}

/**
 * Extended modal data with nested content blocks.
 */
export interface ModalDataWithContent {
  id: string;
  isOpen?: boolean;
  title: string;
  description?: string;
  content: NormalizedBlock[];
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'default' | 'alert' | 'confirm';
  footer?: {
    showCloseButton?: boolean;
    closeLabel?: string;
    actions?: Array<{
      id: string;
      label: string;
      variant?: 'default' | 'secondary' | 'destructive' | 'outline' | 'ghost' | 'link';
      primary?: boolean;
    }>;
  };
  closeOnOverlayClick?: boolean;
  closeOnEsc?: boolean;
  preventScroll?: boolean;
}
