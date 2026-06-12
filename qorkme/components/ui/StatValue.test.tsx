import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { MockIntersectionObserver } from '@/test/setup';
import StatValue from './StatValue';

const srText = (root: HTMLElement) => root.querySelector('[data-slot-sr]')?.textContent ?? null;

const srNumber = (root: HTMLElement) => {
  const sr = srText(root);
  return sr === null ? null : parseInt(sr.replace(/\D/g, ''), 10);
};

describe('StatValue', () => {
  beforeEach(() => vi.useFakeTimers());
  afterEach(() => vi.useRealTimers());

  it('renders value and label as plain text before scrolling into view', () => {
    const { container } = render(<StatValue value="07" label="Client Projects" />);
    expect(screen.getByText('07')).toBeInTheDocument();
    expect(screen.getByText('Client Projects')).toBeInTheDocument();
    expect(container.querySelector('[data-slot-cell]')).toBeNull();
  });

  it('counts up from zero on first view and lands on the real value', () => {
    const { container } = render(<StatValue value="07" label="Client Projects" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    // Count started: cells built at zero over the plain text
    expect(container.querySelector('[data-slot-cell]')).not.toBeNull();
    expect(srText(container)).toBe('00');

    act(() => {
      vi.runAllTimers(); // climb + landing + settle
    });
    expect(srText(container)).toBe('07');
    const chars = Array.from(container.querySelectorAll<HTMLElement>('[data-slot-cell]'))
      .map((c) => c.dataset.char ?? '')
      .join('');
    expect(chars).toBe('07');
  });

  it('the entrance count is monotonically ascending', () => {
    const { container } = render(<StatValue value="100%" label="In-House" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    expect(srText(container)).toBe('000%');
    let prev = 0;
    for (let i = 0; i < 40 && srText(container) !== '100%'; i++) {
      act(() => {
        vi.advanceTimersByTime(190); // one UP step
      });
      const now = srNumber(container)!;
      expect(now).toBeGreaterThanOrEqual(prev);
      prev = now;
    }
    expect(srText(container)).toBe('100%');
  });

  it('preserves prefix/suffix formatting through the count', () => {
    const { container } = render(<StatValue value="100%" label="Dedication" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    expect(srText(container)).toBe('100%');
  });

  it('hover re-verifies: counts down toward zero, then back up to the same value', () => {
    const { container } = render(<StatValue value="100%" label="In-House" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    const stat = container.firstElementChild as HTMLElement;
    fireEvent.pointerOver(stat, { pointerType: 'mouse' }); // onPointerEnter quirk
    act(() => {
      vi.advanceTimersByTime(150); // one DOWN step
    });
    expect(srNumber(container)!).toBeLessThan(100);
    act(() => {
      vi.runAllTimers(); // dip to zero, climb home, land
    });
    expect(srText(container)).toBe('100%');
  });

  it('recovers smoothly when the pointer leaves mid-countdown', () => {
    const { container } = render(<StatValue value="100%" label="In-House" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    const stat = container.firstElementChild as HTMLElement;
    fireEvent.pointerOver(stat, { pointerType: 'mouse' });
    act(() => {
      vi.advanceTimersByTime(450); // a few DOWN steps
    });
    const midway = srNumber(container)!;
    expect(midway).toBeLessThan(100);
    fireEvent.pointerOut(stat, { pointerType: 'mouse' }); // onPointerLeave quirk
    act(() => {
      vi.advanceTimersByTime(190); // first recovery step turns the count around
    });
    expect(srNumber(container)!).toBeGreaterThanOrEqual(midway);
    act(() => {
      vi.runAllTimers();
    });
    expect(srText(container)).toBe('100%');
  });

  it('hovering mid-count redirects the count and the value still lands', () => {
    const { container } = render(<StatValue value="06" label="Years" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
      vi.advanceTimersByTime(300); // mid-climb
    });
    const stat = container.firstElementChild as HTMLElement;
    fireEvent.pointerOver(stat, { pointerType: 'mouse' });
    act(() => {
      vi.runAllTimers();
    });
    expect(srText(container)).toBe('06');
  });

  it('ignores touch pointers for the reverify', () => {
    const { container } = render(<StatValue value="07" label="Client Projects" />);
    act(() => {
      MockIntersectionObserver.instances.forEach((io) => io.trigger(true));
    });
    act(() => {
      vi.runAllTimers();
    });
    const stat = container.firstElementChild as HTMLElement;
    const before = container.innerHTML;
    fireEvent.pointerOver(stat, { pointerType: 'touch' });
    expect(container.innerHTML).toBe(before);
  });
});
