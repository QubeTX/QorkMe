import { describe, it, expect, beforeEach } from 'vitest';
import { render } from '@testing-library/react';
import LoadSequence from './LoadSequence';

describe('LoadSequence', () => {
  beforeEach(() => {
    document.documentElement.setAttribute('data-loading', '');
    document.documentElement.removeAttribute('data-boot');
  });

  it('lifts the data-loading FOUC guard on mount', () => {
    render(<LoadSequence />);
    expect(document.documentElement).not.toHaveAttribute('data-loading');
  });

  it('waits for boot completion when the BootScreen is armed', () => {
    document.documentElement.setAttribute('data-boot', '');
    render(<LoadSequence />);
    // held while the boot overlay runs
    expect(document.documentElement).toHaveAttribute('data-loading');

    window.dispatchEvent(new Event('qubetx:boot-complete'));
    expect(document.documentElement).not.toHaveAttribute('data-loading');
    document.documentElement.removeAttribute('data-boot');
  });

  it('renders nothing', () => {
    const { container } = render(<LoadSequence />);
    expect(container).toBeEmptyDOMElement();
  });
});
