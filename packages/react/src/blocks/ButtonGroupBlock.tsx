import { useState, useCallback } from 'react';
import type { ButtonGroupData, ButtonAction } from '@mcp-interactive-ui/types';

export interface ButtonGroupBlockProps {
  data: ButtonGroupData;
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

// Button variant styles matching shadcn Button component
const buttonVariants: Record<string, string> = {
  primary: 'bg-primary text-primary-foreground hover:bg-primary/90',
  secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
  danger: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
  ghost: 'hover:bg-accent hover:text-accent-foreground',
  outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
  link: 'text-primary underline-offset-4 hover:underline',
};

// Button size styles
const buttonSizes: Record<string, string> = {
  sm: 'h-9 rounded-md px-3',
  md: 'h-10 px-4 py-2',
  lg: 'h-11 rounded-md px-8',
};

/**
 * Renders a `button_group` block with shadcn/ui styling.
 * Supports horizontal, vertical, and grid layouts with various button styles.
 */
export function ButtonGroupBlock({ data, className, blockId, onAction }: ButtonGroupBlockProps): JSX.Element {
  const [confirmingButton, setConfirmingButton] = useState<string | null>(null);
  const [loadingButtons, setLoadingButtons] = useState<Set<string>>(new Set());

  const handleButtonClick = useCallback(async (button: ButtonAction) => {
    // If button has confirmation, show confirmation dialog first
    if (button.confirmation && confirmingButton !== button.id) {
      setConfirmingButton(button.id);
      return;
    }

    // Clear confirmation state
    setConfirmingButton(null);

    // Set loading state
    setLoadingButtons((prev) => new Set(prev).add(button.id));

    try {
      onAction?.('click', {
        buttonId: button.id,
        buttonLabel: button.label,
        timestamp: Date.now(),
      });
    } finally {
      setLoadingButtons((prev) => {
        const next = new Set(prev);
        next.delete(button.id);
        return next;
      });
    }
  }, [confirmingButton, onAction]);

  const handleConfirm = useCallback(() => {
    if (confirmingButton) {
      const button = data.actions.find((a) => a.id === confirmingButton);
      if (button) {
        handleButtonClick(button);
      }
    }
  }, [confirmingButton, data.actions, handleButtonClick]);

  const handleCancelConfirm = useCallback(() => {
    setConfirmingButton(null);
    onAction?.('cancel', {});
  }, [onAction]);

  // Layout classes
  const layoutClass = {
    horizontal: 'flex flex-wrap gap-2',
    vertical: 'flex flex-col gap-2',
    grid: 'grid grid-cols-2 gap-2',
  }[data.layout ?? 'horizontal'];

  // Alignment classes
  const alignClass = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    stretch: '',
  }[data.align ?? 'start'];

  const confirmingButtonData = confirmingButton
    ? data.actions.find((a) => a.id === confirmingButton)?.confirmation
    : null;

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm p-6'}>
      {/* Title and description */}
      {(data.title || data.description) && (
        <div className="mb-4 space-y-1">
          {data.title && <h3 className="text-lg font-semibold">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      {/* Button group */}
      <div className={`${layoutClass} ${data.align === 'stretch' && data.layout === 'vertical' ? '' : alignClass}`}>
        {data.actions.map((button) => {
          const isLoading = loadingButtons.has(button.id);
          const isDisabled = button.disabled || isLoading;
          const variant = button.variant ?? 'secondary';
          const size = button.size ?? data.size ?? 'md';

          return (
            <button
              key={button.id}
              type="button"
              disabled={isDisabled}
              onClick={() => handleButtonClick(button)}
              className={`
                inline-flex items-center justify-center rounded-md text-sm font-medium
                ring-offset-background transition-colors
                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                ${buttonVariants[variant]}
                ${buttonSizes[size]}
                ${data.align === 'stretch' ? 'w-full' : ''}
              `}
            >
              {/* Loading spinner */}
              {isLoading && (
                <svg
                  className="mr-2 h-4 w-4 animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}

              {/* Icon (placeholder - would use lucide-react in real implementation) */}
              {button.icon && button.iconPosition === 'left' && !isLoading && (
                <span className="mr-2">{button.icon}</span>
              )}

              {button.label}

              {button.icon && button.iconPosition === 'right' && !isLoading && (
                <span className="ml-2">{button.icon}</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Confirmation Dialog */}
      {confirmingButtonData && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
          <div className="relative w-full max-w-md rounded-lg border bg-background p-6 shadow-lg">
            <h4 className="text-lg font-semibold">
              {confirmingButtonData.title}
            </h4>
            <p className="mt-2 text-sm text-muted-foreground">
              {confirmingButtonData.message}
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <button
                type="button"
                onClick={handleCancelConfirm}
                className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
              >
                {confirmingButtonData.cancelLabel ?? 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                className={`
                  inline-flex items-center justify-center rounded-md text-sm font-medium
                  ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                  h-10 px-4 py-2
                  ${confirmingButtonData.variant === 'danger'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                  }
                `}
              >
                {confirmingButtonData.confirmLabel ?? 'Confirm'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
