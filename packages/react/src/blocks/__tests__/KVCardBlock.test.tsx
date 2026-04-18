import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { KVCardBlock } from '../KVCardBlock.js';

describe('KVCardBlock link safety', () => {
  it('renders http(s) links as anchors', () => {
    render(
      <KVCardBlock
        data={{
          title: 't',
          fields: [{ label: 'Site', value: 'ex', type: 'link', href: 'https://example.com' }],
        }}
      />,
    );
    const link = screen.getByRole('link', { name: 'ex' });
    expect(link).toHaveAttribute('href', 'https://example.com');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not render javascript: hrefs as links', () => {
    render(
      <KVCardBlock
        data={{
          title: 't',
          fields: [
            // eslint-disable-next-line no-script-url
            { label: 'Site', value: 'ex', type: 'link', href: 'javascript:alert(1)' },
          ],
        }}
      />,
    );
    expect(screen.queryByRole('link')).toBeNull();
  });
});
