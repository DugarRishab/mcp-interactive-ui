import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import type { NormalizedAIResponse } from '@mcp-interactive-ui/types';
import { RenderAIContent } from '../RenderAIContent.js';

describe('RenderAIContent', () => {
  it('renders a table block', () => {
    const data: NormalizedAIResponse = {
      blocks: [
        {
          type: 'data_table',
          id: 'b0',
          data: {
            columns: [{ key: 'name', header: 'Name' }],
            rows: [{ name: 'Ada' }],
          },
        },
      ],
    };
    render(<RenderAIContent data={data} />);
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Ada')).toBeInTheDocument();
  });

  it('renders a notice with the correct variant attribute', () => {
    const data: NormalizedAIResponse = {
      blocks: [
        {
          type: 'notice',
          id: 'b0',
          data: { variant: 'warning', message: 'Something happened' },
        },
      ],
    };
    render(<RenderAIContent data={data} />);
    const alert = screen.getByRole('alert');
    expect(alert).toHaveAttribute('data-variant', 'warning');
    expect(alert).toHaveTextContent('Something happened');
  });

  it('falls back to a notice for unknown block types and invokes callback', () => {
    const data: NormalizedAIResponse = {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      blocks: [{ type: 'chart_3d' as any, id: 'b0', data: {} as any }],
    };
    const onUnknown = vi.fn();
    render(<RenderAIContent data={data} onUnknownBlock={onUnknown} />);
    expect(screen.getByRole('alert')).toHaveTextContent('chart_3d');
    expect(onUnknown).toHaveBeenCalledTimes(1);
  });

  it('honors component overrides', () => {
    const data: NormalizedAIResponse = {
      blocks: [
        {
          type: 'notice',
          id: 'b0',
          data: { variant: 'info', message: 'hi' },
        },
      ],
    };
    render(
      <RenderAIContent
        data={data}
        /* eslint-disable @typescript-eslint/no-explicit-any */
        components={
          {
            notice: ({ data: d }: { data: { message: string } }) => <div data-testid="custom">{d.message}</div>,
          } as any
        }
        /* eslint-enable @typescript-eslint/no-explicit-any */
      />,
    );
    expect(screen.getByTestId('custom')).toHaveTextContent('hi');
  });

  it('renders top-level text as markdown', () => {
    const data: NormalizedAIResponse = {
      text: '**bold**',
      blocks: [],
    };
    render(<RenderAIContent data={data} />);
    expect(screen.getByText('bold').tagName).toBe('STRONG');
  });
});
