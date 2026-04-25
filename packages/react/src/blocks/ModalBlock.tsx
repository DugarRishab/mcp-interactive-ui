import { useState, useEffect, useCallback } from 'react';
import type { ModalData, ModalDataWithContent } from '@mcp-interactive-ui/types';
import { NestedBlockRenderer } from '../components/NestedBlockRenderer.js';

export interface ModalBlockProps {
  data: ModalData & Partial<ModalDataWithContent>;
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

/**
 * Renders a `modal` block with shadcn/ui styling.
 * Supports nested content, footer actions, and various sizes.
 */
export function ModalBlock({ data, className, blockId, onAction }: ModalBlockProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(data.isOpen ?? false);

  // Update local state when data changes
  useEffect(() => {
    setIsOpen(data.isOpen ?? true);
  }, [data.isOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen && data.preventScroll !== false) {
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = '';
      };
    }
  }, [isOpen, data.preventScroll]);

  const handleClose = useCallback((reason: 'overlay' | 'esc' | 'button' | 'action') => {
    setIsOpen(false);

    onAction?.('close', {
      reason,
      timestamp: Date.now(),
    });
  }, [onAction]);

  const handleOverlayClick = useCallback(() => {
    if (data.closeOnOverlayClick !== false) {
      handleClose('overlay');
    }
  }, [data.closeOnOverlayClick, handleClose]);

  const handleEscKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape' && data.closeOnEsc !== false) {
      handleClose('esc');
    }
  }, [data.closeOnEsc, handleClose]);

  // Listen for ESC key
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscKey);
      return () => document.removeEventListener('keydown', handleEscKey);
    }
  }, [isOpen, handleEscKey]);

  const handleFooterAction = useCallback((actionId: string, isPrimary?: boolean) => {
    onAction?.('action_click', {
      actionId,
      isPrimary,
      timestamp: Date.now(),
    });

    // Auto-close on confirm/cancel
    if (data.variant === 'confirm' || data.variant === 'alert') {
      if (isPrimary) {
        onAction?.('confirm', { actionId });
      } else {
        onAction?.('cancel', { actionId });
      }
      setIsOpen(false);
    }
  }, [data.variant, onAction]);

  // Size classes
  const sizeClasses: Record<string, string> = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
    full: 'max-w-full mx-4',
  };

  const sizeClass = sizeClasses[data.size ?? 'md'];

  if (!isOpen) {
    return <></>;
  }

  return (
    <div
      className={className ?? 'fixed inset-0 z-50 flex items-center justify-center'}
      role="dialog"
      aria-modal="true"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity"
        onClick={handleOverlayClick}
      />

      {/* Modal Content */}
      <div
        className={`
          relative w-full ${sizeClass} max-h-[85vh] overflow-y-auto
          rounded-lg border bg-background p-6 shadow-lg
          animate-in fade-in zoom-in-95 duration-200
        `}
      >
        {/* Header */}
        <div className="flex flex-col space-y-1.5 text-center sm:text-left">
          <h2 className="text-lg font-semibold leading-none tracking-tight">
            {data.title}
          </h2>
          {data.description && (
            <p className="text-sm text-muted-foreground">{data.description}</p>
          )}
        </div>

        {/* Body with nested content */}
        <div className="mt-4">
          {data.content && data.content.length > 0 ? (
            <NestedBlockRenderer
              blocks={data.content}
              onBlockAction={(id, type, action, payload) => onAction?.(action, payload)}
              depth={1}
            />
          ) : (
            <div className="text-muted-foreground text-sm">
              Modal content
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2">
          {/* Footer actions */}
          {data.footer?.actions?.map((action) => (
            <button
              key={action.id}
              type="button"
              onClick={() => handleFooterAction(action.id, action.primary)}
              className={`
                inline-flex items-center justify-center rounded-md text-sm font-medium
                ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                h-10 px-4 py-2 mt-2 sm:mt-0
                ${
                  action.variant === 'destructive'
                    ? 'bg-destructive text-destructive-foreground hover:bg-destructive/90'
                    : action.variant === 'secondary'
                    ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    : action.variant === 'outline'
                    ? 'border border-input bg-background hover:bg-accent hover:text-accent-foreground'
                    : action.variant === 'ghost'
                    ? 'hover:bg-accent hover:text-accent-foreground'
                    : action.variant === 'link'
                    ? 'text-primary underline-offset-4 hover:underline'
                    : 'bg-primary text-primary-foreground hover:bg-primary/90'
                }
              `}
            >
              {action.label}
            </button>
          ))}

          {/* Close button */}
          {data.footer?.showCloseButton !== false && (
            <button
              type="button"
              onClick={() => handleClose('button')}
              className="
                inline-flex items-center justify-center rounded-md text-sm font-medium
                ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2
                disabled:pointer-events-none disabled:opacity-50
                border border-input bg-background hover:bg-accent hover:text-accent-foreground
                h-10 px-4 py-2 mt-2 sm:mt-0
              "
            >
              {data.footer?.closeLabel ?? 'Close'}
            </button>
          )}
        </div>

        {/* X button in header (optional) */}
        <button
          type="button"
          onClick={() => handleClose('button')}
          className="
            absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity
            hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2
            disabled:pointer-events-none
          "
        >
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
            className="h-4 w-4"
          >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
          </svg>
          <span className="sr-only">Close</span>
        </button>
      </div>
    </div>
  );
}
