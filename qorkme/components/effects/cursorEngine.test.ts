import { describe, it, expect, beforeEach } from 'vitest';
import { CursorEngine, dtLerp } from './cursorEngine';

function stubEl(): HTMLElement {
  return document.createElement('div');
}

describe('dtLerp', () => {
  it('returns the base factor at exactly one 60Hz frame', () => {
    expect(dtLerp(0.32, 1 / 60)).toBeCloseTo(0.32);
  });

  it('compensates for frame rate (same convergence at 120Hz half-steps)', () => {
    const oneStep = 1 - dtLerp(0.32, 1 / 60);
    const twoHalfSteps = Math.pow(1 - dtLerp(0.32, 1 / 120), 2);
    expect(twoHalfSteps).toBeCloseTo(oneStep, 5);
  });
});

describe('CursorEngine', () => {
  let dot: HTMLElement;
  let ring: HTMLElement;
  let bloom: HTMLElement;
  let engine: CursorEngine;

  beforeEach(() => {
    dot = stubEl();
    ring = stubEl();
    bloom = stubEl();
    engine = new CursorEngine(dot, ring, bloom);
  });

  it('writes transform-only styles on tick (no width/height mutation)', () => {
    engine.move(100, 200);
    engine.tick(1 / 60);
    expect(dot.style.transform).toContain('translate3d(100px, 200px, 0)');
    expect(dot.style.transform).toContain('translate(-50%, -50%)');
    expect(ring.style.transform).toMatch(/scale\(/);
    expect(dot.style.width).toBe('');
    expect(ring.style.width).toBe('');
  });

  it('trails the ring toward the pointer and eventually settles', () => {
    engine.move(500, 500);
    let settled = false;
    for (let i = 0; i < 600 && !settled; i++) {
      settled = engine.tick(1 / 60);
    }
    expect(settled).toBe(true);
    expect(ring.style.transform).toContain('translate3d(500.00px, 500.00px, 0)');
  });

  it('exposes mode on the layers for CSS looks', () => {
    engine.setMode('magnetic', document.createElement('button'));
    expect(ring.dataset.mode).toBe('magnetic');
    engine.setMode('default');
    expect(ring.dataset.mode).toBe('default');
  });

  it('press squashes the target scale; release restores it', () => {
    engine.move(10, 10);
    engine.press(true);
    for (let i = 0; i < 200; i++) engine.tick(1 / 60);
    expect(dot.style.transform).toContain('scale(0.800)');
    engine.press(false);
    for (let i = 0; i < 200; i++) engine.tick(1 / 60);
    expect(dot.style.transform).toContain('scale(1.000)');
  });

  it('shows on move and hides on hide()', () => {
    engine.move(5, 5);
    expect(dot.style.opacity).toBe('1');
    engine.hide();
    expect(dot.style.opacity).toBe('0');
    expect(bloom.style.opacity).toBe('0');
  });
});
