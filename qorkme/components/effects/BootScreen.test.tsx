import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render } from '@testing-library/react';
import BootScreen, { BOOT_DONE_EVENT, BOOT_FLAG } from './BootScreen';

describe('BootScreen', () => {
  beforeEach(() => {
    sessionStorage.clear();
    document.documentElement.removeAttribute('data-boot');
  });
  afterEach(() => {
    document.documentElement.removeAttribute('data-boot');
    vi.useRealTimers();
  });

  it('renders the terminal chrome (server HTML)', () => {
    const { getByText } = render(<BootScreen />);
    expect(getByText(/SYSTEM_INITIALIZER/)).toBeInTheDocument();
    expect(getByText(/NODE_ID: QBTX-01/)).toBeInTheDocument();
    expect(getByText(/INITIALIZING SYSTEM KERNEL/)).toBeInTheDocument();
    expect(getByText(/Asset extraction/i)).toBeInTheDocument();
  });

  it('skip path (no data-boot): completes immediately and stays out of the way', () => {
    const onDone = vi.fn();
    window.addEventListener(BOOT_DONE_EVENT, onDone);
    render(<BootScreen />);
    window.removeEventListener(BOOT_DONE_EVENT, onDone);

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(sessionStorage.getItem(BOOT_FLAG)).toBe('1');
  });

  it('armed path: holds completion until the minimum boot time elapses', async () => {
    vi.useFakeTimers();
    document.documentElement.setAttribute('data-boot', '');

    const onDone = vi.fn();
    window.addEventListener(BOOT_DONE_EVENT, onDone);
    render(<BootScreen />);

    expect(onDone).not.toHaveBeenCalled();
    expect(document.documentElement).toHaveAttribute('data-boot');

    await vi.advanceTimersByTimeAsync(7000);
    window.removeEventListener(BOOT_DONE_EVENT, onDone);

    expect(onDone).toHaveBeenCalledTimes(1);
    expect(document.documentElement).not.toHaveAttribute('data-boot');
    expect(sessionStorage.getItem(BOOT_FLAG)).toBe('1');
  });

  it('armed path: streams the boot log lines', async () => {
    vi.useFakeTimers();
    document.documentElement.setAttribute('data-boot', '');

    const { container } = render(<BootScreen />);
    await vi.advanceTimersByTimeAsync(7000);

    expect(container.textContent).toContain('BOOTSTRAPPING COMPLETE.');
    expect(container.textContent).toContain('ANIME.JS CORE LOADED SUCCESS.');
  });

  it('armed path: the percent readout slot-rolls to 100%', async () => {
    vi.useFakeTimers();
    document.documentElement.setAttribute('data-boot', '');

    const { container } = render(<BootScreen />);
    // The odometer builds roll cells over the server-rendered 0%
    expect(container.querySelector('[data-slot-cell]')).not.toBeNull();

    await vi.advanceTimersByTimeAsync(7000);
    // Accessible text lands on the completed value
    expect(container.querySelector('[data-slot-sr]')?.textContent).toBe('100%');
  });
});
