import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { MockIntersectionObserver } from '@/test/setup';
import TerminalFrame from './TerminalFrame';

const LINES = [
  { text: 'MOUNTING /REPORT/CORE', prompt: false },
  { text: 'CHECKS PASSED', accent: true },
  { text: 'tr300 --json', prompt: true },
];

describe('TerminalFrame', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('server HTML carries the full final text (law: final state first)', () => {
    const { container } = render(<TerminalFrame title="Sample" lines={LINES} />);
    expect(container.textContent).toContain('MOUNTING /REPORT/CORE');
    expect(container.textContent).toContain('CHECKS PASSED');
    expect(container.textContent).toContain('tr300 --json');
  });

  it('boot-prints: lines hide post-mount, then stream in after scroll-into-view', () => {
    const { container } = render(<TerminalFrame title="Sample" lines={LINES} />);
    const rows = [...container.querySelectorAll<HTMLElement>('[data-term-line]')];
    // Hidden client-side before the print (server text untouched)
    rows.forEach((row) => expect(row.style.visibility).toBe('hidden'));

    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    rows.forEach((row) => {
      expect(row.style.visibility).toBe('');
      expect(row).toHaveAttribute('data-term-printed');
    });
  });

  it('stamps real timestamps at reveal time when enabled', () => {
    const { container } = render(<TerminalFrame title="Sample" lines={LINES} timestamps />);
    expect(container.textContent).toContain('[··:··:··]');
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    const ts = container.querySelector('[data-term-ts]');
    expect(ts?.textContent).toMatch(/^\[\d{2}:\d{2}:\d{2}\]$/);
  });

  it('bootPrint={false} renders statically with no timers', () => {
    const { container } = render(<TerminalFrame title="Sample" lines={LINES} bootPrint={false} />);
    const rows = [...container.querySelectorAll<HTMLElement>('[data-term-line]')];
    rows.forEach((row) => expect(row.style.visibility).toBe(''));
  });

  it('cleans up print timers on unmount', () => {
    const { container, unmount } = render(<TerminalFrame title="Sample" lines={LINES} />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    expect(container.querySelector('[data-printing]')).not.toBeNull();
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
