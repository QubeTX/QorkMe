import { describe, it, expect } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useScrolled } from './useScrolled';

const nextFrame = () =>
  act(async () => {
    await new Promise((r) => requestAnimationFrame(r));
  });

describe('useScrolled', () => {
  it('is false at the top and true past the threshold', async () => {
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    const { result } = renderHook(() => useScrolled(24));
    await nextFrame();
    expect(result.current).toBe(false);

    window.scrollY = 100;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await nextFrame();
    expect(result.current).toBe(true);
  });

  it('flips back below the threshold', async () => {
    Object.defineProperty(window, 'scrollY', { value: 100, writable: true });
    const { result } = renderHook(() => useScrolled(24));
    await nextFrame();
    expect(result.current).toBe(true);

    window.scrollY = 0;
    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });
    await nextFrame();
    expect(result.current).toBe(false);
  });
});
