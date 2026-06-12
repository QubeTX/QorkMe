import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { buildSlotText, animateSlotText, attachSlotText, clearSlotText } from '../slotText';

/**
 * Engine tests run on real DOM + fake timers. jsdom realities the engine is
 * designed around: rects are 0 (slide height falls back to 18px, width
 * easing no-ops) and transitionend never fires — so FINAL-state assertions
 * are made after the safety-net rebuild (runAllTimers), exactly the DOM the
 * engine guarantees.
 */

const srText = (el: HTMLElement) => el.querySelector('[data-slot-sr]')?.textContent ?? null;

const cellChars = (el: HTMLElement) =>
  Array.from(el.querySelectorAll<HTMLElement>('[data-slot-cell]'))
    .map((c) => c.dataset.char ?? '')
    .join('');

const cells = (el: HTMLElement) => Array.from(el.querySelectorAll<HTMLElement>('[data-slot-cell]'));

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

describe('buildSlotText', () => {
  it('builds an sr name + one aria-hidden cell per character', () => {
    buildSlotText(el, 'Copy');
    expect(el.hasAttribute('data-slot-text')).toBe(true);
    expect(el.style.display).toBe('inline-flex');
    // First child carries the accessible name as plain text
    expect(el.firstElementChild?.hasAttribute('data-slot-sr')).toBe(true);
    expect(srText(el)).toBe('Copy');
    const slots = cells(el);
    expect(slots).toHaveLength(4);
    slots.forEach((c) => expect(c.getAttribute('aria-hidden')).toBe('true'));
    expect(cellChars(el)).toBe('Copy');
    // Each cell: invisible sizer + visible face showing the glyph
    slots.forEach((c, i) => {
      expect(c.querySelector('[data-slot-sizer]')?.textContent).toBe('Copy'[i]);
      expect(c.querySelector('[data-slot-face]')?.textContent).toBe('Copy'[i]);
    });
  });

  it('maps spaces to NBSP in sizers and faces (cells never collapse)', () => {
    buildSlotText(el, 'a b');
    const space = cells(el)[1];
    expect(space.dataset.char).toBe(' ');
    expect(space.querySelector('[data-slot-sizer]')?.textContent).toBe(' ');
    expect(space.querySelector('[data-slot-face]')?.textContent).toBe(' ');
  });
});

describe('animateSlotText', () => {
  it('updates the accessible name immediately, before any timer fires', () => {
    buildSlotText(el, 'Copy');
    animateSlotText(el, 'Done');
    expect(srText(el)).toBe('Done');
  });

  it('builds directly when the container has no cells yet', () => {
    animateSlotText(el, 'Ready');
    expect(cellChars(el)).toBe('Ready');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('rolls only changed cells (skipUnchanged) — two faces mid-roll', () => {
    buildSlotText(el, 'Copy');
    animateSlotText(el, 'Cozy');
    const faces = cells(el).map((c) => c.querySelectorAll('[data-slot-face]').length);
    expect(faces).toEqual([1, 1, 2, 1]); // only p→z gets an incoming face
  });

  it('settles to a pristine rebuild of the target text', () => {
    buildSlotText(el, 'Copy');
    animateSlotText(el, 'Done');
    vi.runAllTimers();
    expect(cellChars(el)).toBe('Done');
    expect(srText(el)).toBe('Done');
    cells(el).forEach((c) => expect(c.querySelectorAll('[data-slot-face]')).toHaveLength(1));
    expect(vi.getTimerCount()).toBe(0);
  });

  it('grows and shrinks the cell row across different lengths', () => {
    buildSlotText(el, 'NOMINAL');
    expect(cells(el)).toHaveLength(7);
    animateSlotText(el, 'SCANNING');
    vi.runAllTimers();
    expect(cells(el)).toHaveLength(8);
    expect(cellChars(el)).toBe('SCANNING');
    animateSlotText(el, 'SECURE');
    // Mid-roll the row keeps 8 cells (tails roll out without reflow)…
    expect(cells(el)).toHaveLength(8);
    vi.runAllTimers();
    // …and the rebuild drops the empties.
    expect(cells(el)).toHaveLength(6);
    expect(cellChars(el)).toBe('SECURE');
  });

  it('interrupt: a new roll fast-forwards the running one', () => {
    buildSlotText(el, 'AAAA');
    animateSlotText(el, 'BBBB');
    animateSlotText(el, 'CCCC'); // interrupts — first roll snaps to BBBB first
    expect(srText(el)).toBe('CCCC');
    vi.runAllTimers();
    expect(cellChars(el)).toBe('CCCC');
  });

  it('non-interrupt: queued rolls coalesce to the latest request', () => {
    buildSlotText(el, 'AA');
    animateSlotText(el, 'BB');
    animateSlotText(el, 'CC', { interrupt: false }); // deferred
    animateSlotText(el, 'DD', { interrupt: false }); // replaces the deferral
    vi.runAllTimers();
    expect(cellChars(el)).toBe('DD');
  });

  it('non-interrupt: re-rolling the on-screen text is a no-op', () => {
    buildSlotText(el, 'Copy');
    animateSlotText(el, 'Copy', { interrupt: false });
    expect(vi.getTimerCount()).toBe(0);
    expect(cells(el).every((c) => c.querySelectorAll('[data-slot-face]').length === 1)).toBe(true);
  });
});

describe('attachSlotText controller', () => {
  it('flash rolls to the transient label and auto-reverts', () => {
    const label = attachSlotText(el, 'Copy');
    label.flash('Copied');
    expect(srText(el)).toBe('Copied');
    expect(label.value).toBe('Copied');
    vi.runAllTimers(); // flash roll + 1400ms revert + revert roll
    expect(cellChars(el)).toBe('Copy');
    expect(label.value).toBe('Copy');
  });

  it('flash-during-flash still reverts to the original resting text', () => {
    const label = attachSlotText(el, 'Copy');
    label.flash('Copied');
    vi.advanceTimersByTime(300);
    label.flash('Copied'); // spam — coalesces, revert resets
    vi.runAllTimers();
    expect(cellChars(el)).toBe('Copy');
  });

  it('set cancels a pending flash revert', () => {
    const label = attachSlotText(el, 'April');
    label.flash('Saved');
    label.set('May');
    vi.runAllTimers();
    expect(cellChars(el)).toBe('May');
    expect(label.value).toBe('May');
  });

  it('destroy clears every timer and restores plain text', () => {
    const label = attachSlotText(el, 'Copy');
    label.flash('Copied');
    label.destroy();
    expect(vi.getTimerCount()).toBe(0);
    expect(el.hasAttribute('data-slot-text')).toBe(false);
    expect(el.querySelector('[data-slot-cell]')).toBeNull();
    expect(el.textContent).toBe('Copied'); // destroy keeps the current value
  });
});

describe('clearSlotText', () => {
  it('tears down cells and inline structural styles', () => {
    buildSlotText(el, 'Copy');
    clearSlotText(el, 'Copy');
    expect(el.hasAttribute('data-slot-text')).toBe(false);
    expect(el.style.display).toBe('');
    expect(el.textContent).toBe('Copy');
  });
});
