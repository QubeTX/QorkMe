import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Reduced motion = skip to final state. Mock the house store before the
// engine module loads so every animate call takes the snap path.
vi.mock('../useMotionPreference', () => ({
  prefersReducedMotion: () => true,
  useMotionPreference: () => true,
}));

import { buildSlotText, animateSlotText, attachSlotText } from '../slotText';

let el: HTMLElement;

beforeEach(() => {
  vi.useFakeTimers();
  el = document.createElement('span');
  document.body.appendChild(el);
});

afterEach(() => {
  el.remove();
  vi.useRealTimers();
});

describe('slotText under prefers-reduced-motion', () => {
  it('animate snaps instantly to the new value — zero timers scheduled', () => {
    buildSlotText(el, 'Copy');
    animateSlotText(el, 'Copied');
    expect(vi.getTimerCount()).toBe(0);
    const chars = Array.from(el.querySelectorAll<HTMLElement>('[data-slot-cell]'))
      .map((c) => c.dataset.char ?? '')
      .join('');
    expect(chars).toBe('Copied');
    // Single face per cell — no mid-roll duplicates ever exist
    el.querySelectorAll('[data-slot-cell]').forEach((c) =>
      expect(c.querySelectorAll('[data-slot-face]')).toHaveLength(1)
    );
  });

  it('controller flash snaps there and back on the revert timer', () => {
    const label = attachSlotText(el, 'Copy');
    label.flash('Copied');
    expect(el.querySelector('[data-slot-sr]')?.textContent).toBe('Copied');
    vi.runAllTimers();
    expect(el.querySelector('[data-slot-sr]')?.textContent).toBe('Copy');
  });
});
