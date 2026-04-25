import { useState, useCallback } from 'react';
import type { FormInputData, FormField } from '@mcp-interactive-ui/types';

export interface FormInputBlockProps {
  data: FormInputData;
  className?: string;
  blockId?: string;
  onAction?: (action: string, payload: unknown) => void;
}

// Default values for form fields
const getDefaultValue = (field: FormField): unknown => {
  if (field.defaultValue !== undefined) return field.defaultValue;
  if (field.type === 'checkbox') return false;
  if (field.type === 'multiselect') return [];
  return '';
};

// Validate a single field
const validateField = (field: FormField, value: unknown): string | null => {
  if (field.required && (value === '' || value === undefined || value === null)) {
    return `${field.label} is required`;
  }

  if (field.validation && value !== '' && value !== undefined && value !== null) {
    const { min, max, minLength, maxLength, pattern, customError } = field.validation;

    if (min !== undefined && typeof value === 'number' && value < min) {
      return customError || `${field.label} must be at least ${min}`;
    }
    if (max !== undefined && typeof value === 'number' && value > max) {
      return customError || `${field.label} must be at most ${max}`;
    }
    if (minLength !== undefined && typeof value === 'string' && value.length < minLength) {
      return customError || `${field.label} must be at least ${minLength} characters`;
    }
    if (maxLength !== undefined && typeof value === 'string' && value.length > maxLength) {
      return customError || `${field.label} must be at most ${maxLength} characters`;
    }
    if (pattern !== undefined && typeof value === 'string' && !new RegExp(pattern).test(value)) {
      return customError || `${field.label} format is invalid`;
    }
  }

  return null;
};

/**
 * Renders a `form_input` block with shadcn/ui styling.
 * Supports text, email, password, number, textarea, select, checkbox, radio, and date fields.
 */
export function FormInputBlock({ data, className, blockId, onAction }: FormInputBlockProps): JSX.Element {
  // Initialize form values
  const initialValues: Record<string, unknown> = {};
  data.fields.forEach((field) => {
    initialValues[field.name] = getDefaultValue(field);
  });

  const [values, setValues] = useState<Record<string, unknown>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string | null>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleFieldChange = useCallback((field: FormField, value: unknown) => {
    setValues((prev) => ({ ...prev, [field.name]: value }));

    // Real-time validation
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field.name]: error }));

    // Emit field_change action
    onAction?.('field_change', {
      fieldName: field.name,
      value,
      isValid: !error,
    });
  }, [onAction]);

  const handleFieldBlur = useCallback((field: FormField) => {
    const value = values[field.name];
    const error = validateField(field, value);
    setErrors((prev) => ({ ...prev, [field.name]: error }));

    onAction?.('field_blur', {
      fieldName: field.name,
      value,
    });
  }, [onAction, values]);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields
    const newErrors: Record<string, string | null> = {};
    let isValid = true;

    data.fields.forEach((field) => {
      const error = validateField(field, values[field.name]);
      newErrors[field.name] = error;
      if (error) isValid = false;
    });

    setErrors(newErrors);

    if (!isValid) return;

    setIsSubmitting(true);

    try {
      onAction?.('submit', {
        values: { ...values },
        isValid: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  }, [data.fields, onAction, values]);

  const handleCancel = useCallback(() => {
    onAction?.('cancel', {});
  }, [onAction]);

  const handleReset = useCallback(() => {
    const resetValues: Record<string, unknown> = {};
    data.fields.forEach((field) => {
      resetValues[field.name] = getDefaultValue(field);
    });
    setValues(resetValues);
    setErrors({});
    onAction?.('reset', {});
  }, [data.fields, onAction]);

  // Layout classes - default to 2-column grid for better space usage
  const layoutClass = {
    vertical: 'space-y-4',
    horizontal: 'grid grid-cols-2 gap-4',
    grid: `grid grid-cols-${data.columns ?? 2} gap-4`,
  }[data.layout ?? 'grid'];

  const isTextField = (type: string) =>
    ['text', 'email', 'password', 'number', 'url', 'tel', 'date', 'datetime-local', 'time', 'color'].includes(type);

  return (
    <div className={className ?? 'rounded-lg border bg-card text-card-foreground shadow-sm'}>
      {(data.title || data.description) && (
        <div className="flex flex-col space-y-1.5 p-6 pb-0">
          {data.title && <h3 className="text-2xl font-semibold leading-none tracking-tight">{data.title}</h3>}
          {data.description && <p className="text-sm text-muted-foreground">{data.description}</p>}
        </div>
      )}

      <form onSubmit={handleSubmit} className="p-6">
        <div className={layoutClass}>
          {data.fields.map((field) => (
            <div key={field.name} className="space-y-2">
              {field.type !== 'checkbox' && (
                <label
                  htmlFor={`${blockId}-${field.name}`}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {field.label}
                  {field.required && <span className="text-destructive ml-1">*</span>}
                </label>
              )}

              {/* Text/Email/Password/Number/etc input */}
              {isTextField(field.type) && (
                <input
                  id={`${blockId}-${field.name}`}
                  type={field.type}
                  value={(values[field.name] as string) ?? ''}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${blockId}-${field.name}-error` : field.helpText ? `${blockId}-${field.name}-help` : undefined}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}

              {/* Textarea */}
              {field.type === 'textarea' && (
                <textarea
                  id={`${blockId}-${field.name}`}
                  value={(values[field.name] as string) ?? ''}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${blockId}-${field.name}-error` : field.helpText ? `${blockId}-${field.name}-help` : undefined}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  rows={4}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
              )}

              {/* Select */}
              {field.type === 'select' && (
                <select
                  id={`${blockId}-${field.name}`}
                  value={(values[field.name] as string) ?? ''}
                  disabled={field.disabled}
                  required={field.required}
                  aria-invalid={!!errors[field.name]}
                  aria-describedby={errors[field.name] ? `${blockId}-${field.name}-error` : field.helpText ? `${blockId}-${field.name}-help` : undefined}
                  onChange={(e) => handleFieldChange(field, e.target.value)}
                  onBlur={() => handleFieldBlur(field)}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="">{field.placeholder ?? 'Select...'}</option>
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Checkbox */}
              {field.type === 'checkbox' && (
                <div className="flex items-center space-x-2">
                  <input
                    id={`${blockId}-${field.name}`}
                    type="checkbox"
                    checked={(values[field.name] as boolean) ?? false}
                    disabled={field.disabled}
                    onChange={(e) => handleFieldChange(field, e.target.checked)}
                    className="h-4 w-4 rounded border-primary text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                  />
                  <label
                    htmlFor={`${blockId}-${field.name}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {field.label}
                    {field.required && <span className="text-destructive ml-1">*</span>}
                  </label>
                </div>
              )}

              {/* Radio */}
              {field.type === 'radio' && (
                <div className="space-y-2">
                  {field.options?.map((option) => (
                    <div key={option.value} className="flex items-center space-x-2">
                      <input
                        id={`${blockId}-${field.name}-${option.value}`}
                        type="radio"
                        name={field.name}
                        value={option.value}
                        checked={(values[field.name] as string) === option.value}
                        disabled={field.disabled || option.disabled}
                        required={field.required}
                        onChange={(e) => handleFieldChange(field, e.target.value)}
                        className="h-4 w-4 border-primary text-primary focus:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                      />
                      <label
                        htmlFor={`${blockId}-${field.name}-${option.value}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {option.label}
                      </label>
                    </div>
                  ))}
                </div>
              )}

              {/* Multiselect */}
              {field.type === 'multiselect' && (
                <select
                  id={`${blockId}-${field.name}`}
                  multiple
                  value={(values[field.name] as string[]) ?? []}
                  disabled={field.disabled}
                  onChange={(e) => {
                    const selected = Array.from(e.target.selectedOptions).map((opt) => opt.value);
                    handleFieldChange(field, selected);
                  }}
                  className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {field.options?.map((option) => (
                    <option key={option.value} value={option.value} disabled={option.disabled}>
                      {option.label}
                    </option>
                  ))}
                </select>
              )}

              {/* Error message */}
              {errors[field.name] && (
                <p id={`${blockId}-${field.name}-error`} className="text-sm font-medium text-destructive" role="alert" aria-live="polite">{errors[field.name]}</p>
              )}

              {/* Help text */}
              {!errors[field.name] && field.helpText && (
                <p id={`${blockId}-${field.name}-help`} className="text-sm text-muted-foreground">{field.helpText}</p>
              )}
            </div>
          ))}
        </div>

        {/* Form actions */}
        <div className="flex justify-end gap-2 mt-6">
          {data.resetLabel && (
            <button
              type="button"
              onClick={handleReset}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              {data.resetLabel}
            </button>
          )}
          {data.cancelLabel && (
            <button
              type="button"
              onClick={handleCancel}
              disabled={isSubmitting}
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
            >
              {data.cancelLabel}
            </button>
          )}
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            {isSubmitting ? 'Submitting...' : (data.submitLabel ?? 'Submit')}
          </button>
        </div>
      </form>
    </div>
  );
}
