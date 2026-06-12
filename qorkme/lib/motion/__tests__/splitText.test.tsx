import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { splitText } from '../splitText';
import { RevealText } from '../RevealText';

describe('splitText', () => {
  it('words mode wraps each word in a mask + reveal pair, preserving spaces', () => {
    const { container } = render(<p>{splitText('Solid code wins', 'words')}</p>);
    expect(container.querySelectorAll('[data-reveal-mask]')).toHaveLength(3);
    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(3);
    expect(container.textContent).toBe('Solid code wins');
  });

  it('chars mode splits to characters grouped in nowrap words', () => {
    const { container } = render(<p>{splitText('ab cd', 'chars')}</p>);
    expect(container.querySelectorAll('[data-reveal]')).toHaveLength(4);
    expect(container.textContent).toBe('ab cd');
  });

  it('handles unicode graphemes without dropping content', () => {
    const { container } = render(<p>{splitText('⠿ dots', 'chars')}</p>);
    expect(container.textContent).toBe('⠿ dots');
  });
});

describe('RevealText', () => {
  it('renders fully readable text (final state) with animations mocked', () => {
    render(<RevealText text="What we build" as="h2" mode="words" />);
    const heading = screen.getByRole('heading', { name: 'What we build' });
    expect(heading).toBeInTheDocument();
    expect(heading.textContent).toBe('What we build');
  });
});
