import { StrictMode } from 'react';
import { act, cleanup, render } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { SiteCursor } from '@/components/brand/SiteCursor';

const ready = vi.hoisted(() => new Map<string, () => void>());
vi.mock('next/script', () => ({
  default: ({ id, onReady }: { id: string; onReady: () => void }) => {
    ready.set(id, onReady);
    return null;
  },
}));

describe('shared site cursor lifecycle', () => {
  beforeEach(() => ready.clear());
  afterEach(() => {
    cleanup();
    delete window.ShaughvCursor;
    delete window.ShaughvDropdown;
    vi.restoreAllMocks();
  });

  it('waits for the hosted scripts, mounts once, and destroys both owners on unmount', () => {
    const cursor = { destroy: vi.fn() };
    const dropdowns = { destroy: vi.fn() };
    const mountCursor = vi.fn(() => cursor);
    const mountDropdowns = vi.fn(() => dropdowns);
    window.ShaughvCursor = { mount: mountCursor };
    window.ShaughvDropdown = { mount: mountDropdowns };
    const view = render(
      <StrictMode>
        <SiteCursor />
      </StrictMode>
    );
    expect(mountCursor).not.toHaveBeenCalled();
    expect(mountDropdowns).not.toHaveBeenCalled();

    act(() => ready.get('qorkme-shared-cursor')!());
    expect(mountCursor).toHaveBeenCalledExactlyOnceWith({ color: 'var(--color-primary)' });
    expect(mountDropdowns).not.toHaveBeenCalled();
    act(() => {
      ready.get('qorkme-shared-cursor')!();
      ready.get('qorkme-shared-dropdowns')!();
    });
    expect(mountCursor).toHaveBeenCalledTimes(1);
    expect(mountDropdowns).toHaveBeenCalledTimes(1);
    view.unmount();
    expect(cursor.destroy).toHaveBeenCalledTimes(1);
    expect(dropdowns.destroy).toHaveBeenCalledTimes(1);
  });

  it('allows a script to fail without stopping the other enhancement', () => {
    const dropdowns = { destroy: vi.fn() };
    window.ShaughvDropdown = { mount: vi.fn(() => dropdowns) };
    render(<SiteCursor />);
    act(() => {
      ready.get('qorkme-shared-cursor')!();
      ready.get('qorkme-shared-dropdowns')!();
    });
    expect(window.ShaughvDropdown.mount).toHaveBeenCalledTimes(1);
  });

  it('does not turn an optional initialization failure into a page error', () => {
    const warning = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const fail = () => {
      throw new Error('Decoration unavailable');
    };
    window.ShaughvCursor = { mount: fail };
    window.ShaughvDropdown = { mount: fail };
    render(<SiteCursor />);
    expect(() => {
      act(() => {
        ready.get('qorkme-shared-cursor')!();
        ready.get('qorkme-shared-dropdowns')!();
      });
    }).not.toThrow();
    expect(warning).toHaveBeenCalledTimes(2);
  });
});
