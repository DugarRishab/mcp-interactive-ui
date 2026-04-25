import type { BlockAction, ValidateActionResult } from '@mcp-interactive-ui/types';
import type { FrozenRegistry } from '../registry/registry.js';

/**
 * Valid action types for each interactive block.
 */
const VALID_ACTIONS_BY_BLOCK_TYPE: Record<string, string[]> = {
  form_input: ['field_change', 'field_blur', 'submit', 'cancel', 'reset'],
  button_group: ['click', 'cancel'],
  tabs: ['tab_change'],
  accordion: ['section_toggle'],
  modal: ['open', 'close', 'action_click', 'confirm', 'cancel'],
  progress: ['step_click'],
};

export interface ValidateActionOptions {
  /** The registry to validate against (optional - if not provided, only basic structure validation is performed) */
  registry?: FrozenRegistry;
  /** Whether to require the block to be registered (default: true if registry provided) */
  requireRegisteredBlock?: boolean;
}

/**
 * Validates a block action against the registry and known action types.
 *
 * @param action - The action to validate
 * @param options - Validation options
 * @returns Validation result
 *
 * @example
 * ```typescript
 * const result = validateAction({
 *   blockId: 'form-1',
 *   blockType: 'form_input',
 *   action: 'submit',
 *   payload: { values: { email: 'test@example.com' } },
 *   timestamp: Date.now(),
 * });
 *
 * if (!result.success) {
 *   console.error('Invalid action:', result.errors);
 * }
 * ```
 */
export function validateAction(
  action: unknown,
  options: ValidateActionOptions = {}
): ValidateActionResult {
  const errors: string[] = [];

  // Basic structure validation
  if (!action || typeof action !== 'object') {
    return { success: false, errors: ['Action must be an object'] };
  }

  const a = action as Record<string, unknown>;

  // Validate required fields
  if (typeof a.blockId !== 'string' || a.blockId.length === 0) {
    errors.push('blockId is required and must be a non-empty string');
  }

  if (typeof a.blockType !== 'string' || a.blockType.length === 0) {
    errors.push('blockType is required and must be a non-empty string');
  }

  if (typeof a.action !== 'string' || a.action.length === 0) {
    errors.push('action is required and must be a non-empty string');
  }

  if (typeof a.timestamp !== 'number' || a.timestamp <= 0) {
    errors.push('timestamp is required and must be a positive number');
  }

  // If basic validation fails, return early
  if (errors.length > 0) {
    return { success: false, errors };
  }

  const blockType = a.blockType as string;
  const actionType = a.action as string;

  // Validate that the action is valid for the block type
  const validActions = VALID_ACTIONS_BY_BLOCK_TYPE[blockType];
  if (validActions && !validActions.includes(actionType)) {
    errors.push(
      `Invalid action "${actionType}" for block type "${blockType}". Valid actions: ${validActions.join(', ')}`
    );
  }

  // Validate against registry if provided
  if (options.registry) {
    const blockDef = options.registry.get(blockType as import('@mcp-interactive-ui/types').BlockType);

    if (!blockDef) {
      if (options.requireRegisteredBlock !== false) {
        errors.push(`Block type "${blockType}" is not registered`);
      }
    } else {
      // Check if this is an interactive block
      if (blockDef.category !== 'interactive' && !VALID_ACTIONS_BY_BLOCK_TYPE[blockType]) {
        errors.push(`Block type "${blockType}" is not an interactive block and cannot emit actions`);
      }
    }
  }

  // Validate payload structure for known action types
  const payloadErrors = validatePayloadStructure(blockType, actionType, a.payload);
  errors.push(...payloadErrors);

  return errors.length === 0 ? { success: true } : { success: false, errors };
}

/**
 * Validates the payload structure for known action types.
 */
function validatePayloadStructure(
  blockType: string,
  actionType: string,
  payload: unknown
): string[] {
  const errors: string[] = [];

  if (payload === undefined || payload === null) {
    return errors; // Payload can be empty for some actions
  }

  if (typeof payload !== 'object' || payload === null) {
    return ['payload must be an object if provided'];
  }

  const p = payload as Record<string, unknown>;

  switch (blockType) {
    case 'form_input':
      switch (actionType) {
        case 'submit':
          if (!p.values || typeof p.values !== 'object') {
            errors.push('form_input submit action requires payload.values object');
          }
          if (typeof p.isValid !== 'boolean') {
            errors.push('form_input submit action requires payload.isValid boolean');
          }
          break;
        case 'field_change':
          if (typeof p.fieldName !== 'string') {
            errors.push('form_input field_change action requires payload.fieldName string');
          }
          break;
        case 'field_blur':
          if (typeof p.fieldName !== 'string') {
            errors.push('form_input field_blur action requires payload.fieldName string');
          }
          break;
      }
      break;

    case 'button_group':
      if (actionType === 'click') {
        if (typeof p.buttonId !== 'string') {
          errors.push('button_group click action requires payload.buttonId string');
        }
        if (typeof p.buttonLabel !== 'string') {
          errors.push('button_group click action requires payload.buttonLabel string');
        }
      }
      break;

    case 'tabs':
      if (actionType === 'tab_change') {
        if (typeof p.fromTabId !== 'string') {
          errors.push('tabs tab_change action requires payload.fromTabId string');
        }
        if (typeof p.toTabId !== 'string') {
          errors.push('tabs tab_change action requires payload.toTabId string');
        }
      }
      break;

    case 'accordion':
      if (actionType === 'section_toggle') {
        if (typeof p.itemId !== 'string') {
          errors.push('accordion section_toggle action requires payload.itemId string');
        }
        if (typeof p.isOpen !== 'boolean') {
          errors.push('accordion section_toggle action requires payload.isOpen boolean');
        }
      }
      break;

    case 'modal':
      switch (actionType) {
        case 'close':
          if (p.reason && typeof p.reason !== 'string') {
            errors.push('modal close action payload.reason must be a string');
          }
          break;
        case 'action_click':
          if (typeof p.actionId !== 'string') {
            errors.push('modal action_click action requires payload.actionId string');
          }
          break;
      }
      break;

    case 'progress':
      if (actionType === 'step_click') {
        if (typeof p.stepId !== 'string') {
          errors.push('progress step_click action requires payload.stepId string');
        }
      }
      break;
  }

  return errors;
}

/**
 * Type guard to check if an action is valid.
 */
export function isValidAction(action: unknown, options?: ValidateActionOptions): action is BlockAction {
  return validateAction(action, options).success;
}
