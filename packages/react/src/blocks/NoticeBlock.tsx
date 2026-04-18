import type { NoticeData, NoticeVariant } from '@mcp-interactive-ui/types';

export interface NoticeBlockProps {
  data: NoticeData;
  className?: string;
}

const VARIANT_CLASSES: Record<NoticeVariant, string> = {
  info: 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-900/60 dark:bg-sky-950/40 dark:text-sky-100',
  success:
    'border-emerald-200 bg-emerald-50 text-emerald-900 dark:border-emerald-900/60 dark:bg-emerald-950/40 dark:text-emerald-100',
  warning:
    'border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-900/60 dark:bg-amber-950/40 dark:text-amber-100',
  error:
    'border-rose-200 bg-rose-50 text-rose-900 dark:border-rose-900/60 dark:bg-rose-950/40 dark:text-rose-100',
};

export function NoticeBlock({ data, className }: NoticeBlockProps): JSX.Element {
  return (
    <div
      role="alert"
      data-variant={data.variant}
      className={
        className ??
        `relative w-full rounded-lg border p-4 text-sm ${VARIANT_CLASSES[data.variant]}`
      }
    >
      {data.title ? <div className="mb-1 font-medium leading-none">{data.title}</div> : null}
      <div className="leading-relaxed">{data.message}</div>
    </div>
  );
}
