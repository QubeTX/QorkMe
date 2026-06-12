import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, act } from '@testing-library/react';
import { MockIntersectionObserver } from '@/test/setup';
import SysStatus from './SysStatus';

const srText = (root: HTMLElement) => root.querySelector('[data-slot-sr]')?.textContent ?? null;

describe('SysStatus', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders the status line as decorative flavor (aria-hidden)', () => {
    const { container } = render(<SysStatus />);
    const line = container.firstElementChild as HTMLElement;
    expect(line).toHaveAttribute('aria-hidden', 'true');
    expect(line.textContent).toContain('SYS_STATUS:');
    expect(srText(container)).toBe('NOMINAL');
  });

  it('cycles the status word while visible', () => {
    const { container } = render(<SysStatus />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(srText(container)).toBe('SCANNING');
    act(() => {
      vi.advanceTimersByTime(7000);
    });
    expect(srText(container)).toBe('SECURE');
  });

  it('pauses offscreen', () => {
    const { container } = render(<SysStatus />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(false));
    });
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(srText(container)).toBe('NOMINAL');
  });

  it('pauses in hidden tabs', () => {
    const { container } = render(<SysStatus />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    vi.spyOn(document, 'visibilityState', 'get').mockReturnValue('hidden');
    act(() => {
      vi.advanceTimersByTime(21000);
    });
    expect(srText(container)).toBe('NOMINAL');
    vi.restoreAllMocks();
  });

  it('cleans up its interval and observer on unmount', () => {
    const { unmount } = render(<SysStatus />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    unmount();
    act(() => {
      vi.advanceTimersByTime(28000); // would throw if the interval touched DOM
    });
    expect(vi.getTimerCount()).toBe(0);
  });
});
