import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { render } from '@testing-library/react';
import { SlotRoll, useSlotRoll } from '../SlotRoll';

const srText = (el: HTMLElement | null) => el?.querySelector('[data-slot-sr]')?.textContent ?? null;

const cellChars = (el: HTMLElement | null) =>
  Array.from(el?.querySelectorAll<HTMLElement>('[data-slot-cell]') ?? [])
    .map((c) => c.dataset.char ?? '')
    .join('');

beforeEach(() => vi.useFakeTimers());
afterEach(() => vi.useRealTimers());

describe('SlotRoll', () => {
  it('renders the plain final text (server HTML rule), then builds cells', () => {
    const { container } = render(<SlotRoll text="NOMINAL" />);
    const el = container.firstElementChild as HTMLElement;
    // Cells were built on mount, accessible name intact
    expect(srText(el)).toBe('NOMINAL');
    expect(cellChars(el)).toBe('NOMINAL');
    expect(container.textContent).toContain('NOMINAL');
  });

  it('rolls to the new text on prop change', () => {
    const { container, rerender } = render(<SlotRoll text="NOMINAL" />);
    const el = container.firstElementChild as HTMLElement;
    rerender(<SlotRoll text="SCANNING" />);
    expect(srText(el)).toBe('SCANNING'); // immediate for assistive tech
    vi.runAllTimers();
    expect(cellChars(el)).toBe('SCANNING');
  });

  it('supports a custom tag and className', () => {
    const { container } = render(<SlotRoll text="47" as="div" className="kpi" />);
    const el = container.firstElementChild as HTMLElement;
    expect(el.tagName).toBe('DIV');
    expect(el.className).toBe('kpi');
  });

  it('unmounts without leaking timers', () => {
    const { rerender, unmount } = render(<SlotRoll text="A" />);
    rerender(<SlotRoll text="B" />);
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

type SlotHandle = ReturnType<typeof useSlotRoll>[1];

function Probe({ onReady }: { onReady: (api: SlotHandle) => void }) {
  const [labelRef, label] = useSlotRoll('Copy');
  onReady(label);
  return <span ref={labelRef}>Copy</span>;
}

describe('useSlotRoll', () => {
  it('attaches cells over the resting text and drives set/flash', () => {
    let api!: SlotHandle;
    const { container, unmount } = render(<Probe onReady={(a) => (api = a)} />);
    const el = container.firstElementChild as HTMLElement;
    expect(cellChars(el)).toBe('Copy');

    api.flash('Copied');
    expect(srText(el)).toBe('Copied');
    vi.runAllTimers();
    expect(cellChars(el)).toBe('Copy'); // auto-reverted

    api.set('Done');
    vi.runAllTimers();
    expect(cellChars(el)).toBe('Done');

    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});
