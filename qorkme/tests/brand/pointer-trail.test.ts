// @vitest-environment jsdom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createPointerTrail } from '@/components/brand/effects/pointer-trail';

describe('decorative pointer wake lifecycle', () => {
  const context = {
    clearRect: vi.fn(),
    fillRect: vi.fn(),
    fillText: vi.fn(),
    setTransform: vi.fn(),
  };
  let canvas: HTMLCanvasElement;
  let renderer: ReturnType<typeof createPointerTrail>;
  const move = (pointerType = 'mouse', x = 200, y = 200) => {
    const event = new MouseEvent('pointermove', { clientX: x, clientY: y });
    Object.defineProperty(event, 'pointerType', { value: pointerType });
    window.dispatchEvent(event);
  };

  beforeEach(() => {
    vi.useFakeTimers({ toFake: ['performance', 'requestAnimationFrame', 'cancelAnimationFrame'] });
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockReturnValue(
      context as unknown as CanvasRenderingContext2D
    );
    canvas = document.createElement('canvas');
    renderer = createPointerTrail(canvas);
  });
  afterEach(() => {
    renderer.dispose();
    vi.useRealTimers();
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
    vi.clearAllMocks();
  });

  it('draws only after pointer movement and releases the clock when the wake fades', () => {
    expect(vi.getTimerCount()).toBe(0);
    move();
    vi.advanceTimersByTime(100);
    expect(context.fillText).toHaveBeenCalled();
    expect(canvas.dataset.trailState).toBe('active');
    // Repeated stationary events must not keep the decoration alive.
    move();
    vi.advanceTimersByTime(1000);
    expect(canvas.dataset.trailState).toBe('idle');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('does not start for touch input', () => {
    move('touch');
    expect(canvas.dataset.trailState).toBe('idle');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('clears on scrolling, typing, and tab hiding without reviving an old trail', () => {
    for (const event of [new Event('scroll'), new KeyboardEvent('keydown', { key: 'Tab' })]) {
      move();
      window.dispatchEvent(event);
      expect(canvas.dataset.trailState).toBe('idle');
      expect(vi.getTimerCount()).toBe(0);
    }
    move();
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(true);
    document.dispatchEvent(new Event('visibilitychange'));
    move('mouse', 220, 200);
    expect(vi.getTimerCount()).toBe(0);
    vi.spyOn(document, 'hidden', 'get').mockReturnValue(false);
    document.dispatchEvent(new Event('visibilitychange'));
    expect(canvas.dataset.trailState).toBe('idle');
    expect(vi.getTimerCount()).toBe(0);
  });

  it('removes pointer listeners and scheduled frames on disposal', () => {
    move();
    renderer.dispose();
    move('mouse', 220, 200);
    window.dispatchEvent(new Event('resize'));
    expect(vi.getTimerCount()).toBe(0);
    expect(canvas.dataset.trailState).toBe('idle');
  });

  it('caps the backing buffer on a large high-density display', () => {
    vi.stubGlobal('innerWidth', 5000);
    vi.stubGlobal('innerHeight', 3000);
    vi.stubGlobal('devicePixelRatio', 4);
    window.dispatchEvent(new Event('resize'));
    vi.advanceTimersByTime(20);
    expect(canvas.width * canvas.height).toBeLessThan(2_003_000);
    expect(vi.getTimerCount()).toBe(0);
  });
});
