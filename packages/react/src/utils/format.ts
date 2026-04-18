export function formatCurrency(value: unknown, locale = 'en-US', currency = 'USD'): string {
  if (typeof value === 'number') {
    return new Intl.NumberFormat(locale, { style: 'currency', currency }).format(value);
  }
  return String(value ?? '');
}

export function formatDate(value: unknown, locale = 'en-US'): string {
  if (value == null) return '';
  const d = value instanceof Date ? value : new Date(String(value));
  if (Number.isNaN(d.getTime())) return String(value);
  return d.toLocaleDateString(locale, { year: 'numeric', month: 'short', day: 'numeric' });
}

export function formatCell(value: unknown): string {
  if (value == null) return '';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  return String(value);
}
