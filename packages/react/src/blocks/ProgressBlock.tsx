import { useCallback } from 'react';
import type { ProgressData } from '@mcp-interactive-ui/types';

export interface ProgressBlockProps {
  data: ProgressData;
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

/**
 * Renders a `progress` block with shadcn/ui styling.
 * Supports linear, circular, and step variants.
 */
export function ProgressBlock({ data, className, blockId, onAction }: ProgressBlockProps): JSX.Element {
  const variant = data.variant ?? 'linear';
  const size = data.size ?? 'md';
  const color = data.color ?? 'primary';
  const value = data.value ?? 0;
  const max = data.max ?? 100;
  const percentage = Math.round((value / max) * 100);
  const progressId = blockId ?? `progress-${Math.random().toString(36).substr(2, 9)}`;

  const handleStepClick = useCallback((stepId: string) => {
    if (data.clickable) {
      onAction?.('step_click', {
        stepId,
        timestamp: Date.now(),
      });
    }
  }, [data.clickable, onAction]);

  // Color classes
  const colorClasses: Record<string, string> = {
    default: 'bg-primary',
    primary: 'bg-primary',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    error: 'bg-destructive',
  };

  const colorClass = colorClasses[color] ?? colorClasses.primary;

  // Size classes for linear
  const linearSizeClasses: Record<string, string> = {
    sm: 'h-2',
    md: 'h-4',
    lg: 'h-6',
  };

  // Size classes for circular
  const circularSizeClasses: Record<string, { size: number; stroke: number }> = {
    sm: { size: 64, stroke: 4 },
    md: { size: 96, stroke: 6 },
    lg: { size: 128, stroke: 8 },
  };

  const circularSize = circularSizeClasses[size] ?? circularSizeClasses['md'];
  const sizeValue = circularSize?.size ?? 96;
  const strokeValue = circularSize?.stroke ?? 6;

  // Step status colors
  const stepStatusColors: Record<string, string> = {
    pending: 'bg-muted text-muted-foreground',
    in_progress: 'bg-primary/20 text-primary border-primary',
    completed: 'bg-primary text-primary-foreground',
    error: 'bg-destructive/20 text-destructive border-destructive',
    skipped: 'bg-muted/50 text-muted-foreground',
  };

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm p-6'}>
      {/* Title */}
      {data.title && (
        <h3 className="text-lg font-semibold mb-4">{data.title}</h3>
      )}

      {/* Linear Progress */}
      {variant === 'linear' && (
        <div className="space-y-2">
          {(data.label || data.sublabel) && (
            <div className="flex justify-between text-sm">
              {data.label && <span>{data.label}</span>}
              {data.sublabel && <span className="text-muted-foreground">{data.sublabel}</span>}
            </div>
          )}

          <div
            className={`w-full overflow-hidden rounded-full bg-secondary ${linearSizeClasses[size]}`}
            role="progressbar"
            aria-valuenow={data.indeterminate ? undefined : value}
            aria-valuemin={0}
            aria-valuemax={max}
            aria-valuetext={data.indeterminate ? 'Loading...' : `${percentage}%`}
            aria-label={data.label || data.title || 'Progress'}
            aria-busy={data.indeterminate}
          >
            {data.indeterminate ? (
              <div className={`h-full ${colorClass} animate-pulse w-1/3`} />
            ) : (
              <div
                className={`h-full ${colorClass} transition-all duration-300`}
                style={{ width: `${percentage}%` }}
              />
            )}
          </div>

          {data.showPercentage !== false && !data.indeterminate && (
            <div className="text-right text-sm text-muted-foreground">{percentage}%</div>
          )}
        </div>
      )}

      {/* Circular Progress */}
      {variant === 'circular' && (
        <div className="flex flex-col items-center gap-2">
          <div className="relative">
            <svg
              width={sizeValue}
              height={sizeValue}
              className="-rotate-90"
            >
              {/* Background circle */}
              <circle
                cx={sizeValue / 2}
                cy={sizeValue / 2}
                r={(sizeValue - strokeValue) / 2}
                fill="none"
                stroke="currentColor"
                strokeWidth={strokeValue}
                className="text-secondary"
              />
              {/* Progress circle */}
              {!data.indeterminate && (
                <circle
                  cx={sizeValue / 2}
                  cy={sizeValue / 2}
                  r={(sizeValue - strokeValue) / 2}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={strokeValue}
                  strokeLinecap="round"
                  strokeDasharray={`${percentage * Math.PI * (sizeValue - strokeValue) / 100} ${Math.PI * (sizeValue - strokeValue)}`}
                  className={(colorClass ?? 'bg-primary').replace('bg-', 'text-')}
                />
              )}
            </svg>

            {data.indeterminate && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`h-8 w-8 animate-spin rounded-full border-4 border-secondary border-t-${(colorClass ?? 'bg-primary').replace('bg-', '')}`} />
              </div>
            )}

            {data.showPercentage !== false && !data.indeterminate && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-lg font-semibold">{percentage}%</span>
              </div>
            )}
          </div>

          {data.label && <span className="text-sm text-muted-foreground">{data.label}</span>}
        </div>
      )}

      {/* Steps Progress */}
      {(variant === 'steps' || variant === 'vertical_steps') && (
        (() => {
          const steps = data.steps ?? [];
          if (steps.length === 0) return null;
          return (
        <div className={variant === 'vertical_steps' ? 'space-y-4' : 'flex items-center justify-between'}>
          {steps.map((step, index) => {
            const isActive = data.currentStep === step.id;
            const status = step.status ?? 'pending';

            return (
              <div
                key={step.id}
                className={`
                  flex ${variant === 'vertical_steps' ? 'flex-row items-start gap-3' : 'flex-col items-center gap-2'}
                  ${data.clickable ? 'cursor-pointer' : ''}
                `}
                onClick={() => handleStepClick(step.id)}
              >
                {/* Step indicator */}
                <div
                  className={`
                    flex items-center justify-center rounded-full border-2 text-sm font-medium
                    ${variant === 'vertical_steps' ? 'h-8 w-8 shrink-0' : 'h-10 w-10'}
                    ${stepStatusColors[status]}
                    ${isActive ? 'ring-2 ring-ring ring-offset-2' : ''}
                  `}
                >
                  {status === 'completed' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M20 6 9 17l-5-5" />
                    </svg>
                  ) : status === 'error' ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <line x1="15" x2="9" y1="9" y2="15" />
                      <line x1="9" x2="15" y1="9" y2="15" />
                    </svg>
                  ) : (
                    step.icon || index + 1
                  )}
                </div>

                {/* Step label */}
                <div className={variant === 'vertical_steps' ? 'flex-1' : 'text-center'}>
                  <div className={`text-sm font-medium ${isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                    {step.label}
                  </div>
                  {step.description && (
                    <div className="text-xs text-muted-foreground">{step.description}</div>
                  )}
                  {status === 'error' && step.errorMessage && (
                    <div className="text-xs text-destructive">{step.errorMessage}</div>
                  )}
                </div>

                {/* Connector line (horizontal only) */}
                {variant === 'steps' && index < steps.length - 1 && (
                  <div className={`absolute h-0.5 flex-1 bg-muted ${index < steps.findIndex(s => s.status === 'completed') ? 'bg-primary' : ''}`} />
                )}
              </div>
            );
          })}
        </div>
          );
        })()
      )}
    </div>
  );
}
