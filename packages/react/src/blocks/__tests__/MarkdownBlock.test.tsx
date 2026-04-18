import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { MarkdownBlock } from '../MarkdownBlock.js';

describe('MarkdownBlock sanitization', () => {
  it('strips <script> tags', () => {
    const { container } = render(
      <MarkdownBlock data={{ content: 'hi<script>alert(1)</script>' }} />,
    );
    expect(container.querySelector('script')).toBeNull();
  });

  it('strips javascript: hrefs', () => {
    const { container } = render(
      // eslint-disable-next-line no-script-url
      <MarkdownBlock data={{ content: '[click](javascript:alert(1))' }} />,
    );
    const a = container.querySelector('a');
    // rehype-sanitize either removes the href or drops the anchor entirely.
    if (a) {
      const href = a.getAttribute('href');
      if (href !== null) expect(href).not.toMatch(/javascript:/i);
    }
  });

  it('renders GFM tables', () => {
    const md = '| a | b |\n|---|---|\n| 1 | 2 |';
    const { container } = render(<MarkdownBlock data={{ content: md }} />);
    expect(container.querySelector('table')).not.toBeNull();
  });
});
