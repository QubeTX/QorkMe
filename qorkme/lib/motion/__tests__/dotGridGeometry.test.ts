import { describe, it, expect } from 'vitest';
import {
  applyRippleWaves,
  computeGrid,
  makeRippleWave,
  nearestDotIndex,
  rippleFalloff,
  MAX_DOTS,
  RIPPLE_AMP_FLOOR,
  RIPPLE_LIFE_MS,
} from '../dotGridGeometry';

describe('computeGrid', () => {
  it('returns an empty grid for degenerate boxes', () => {
    expect(computeGrid(0, 100).dots).toHaveLength(0);
    expect(computeGrid(100, -5).dots).toHaveLength(0);
  });

  it('fills the box at the requested pitch', () => {
    const geo = computeGrid(280, 280, 28);
    expect(geo.cols).toBe(10);
    expect(geo.rows).toBe(10);
    expect(geo.dots).toHaveLength(100);
  });

  it('widens the pitch instead of exceeding the dot budget', () => {
    const geo = computeGrid(4000, 4000, 28);
    expect(geo.dots.length).toBeLessThanOrEqual(MAX_DOTS);
    expect(geo.pitch).toBeGreaterThan(28);
  });

  it('ramps size/alpha/color toward the bottom-right (mockup gradient)', () => {
    const geo = computeGrid(560, 560, 28);
    const first = geo.dots[0];
    const last = geo.dots[geo.dots.length - 1];
    expect(first.baseR).toBeLessThan(last.baseR);
    expect(first.baseA).toBeLessThan(last.baseA);
    expect(first.baseMix).toBe(0);
    expect(last.baseMix).toBe(1);
  });

  it('initializes animation channels at identity', () => {
    const geo = computeGrid(100, 100, 28);
    for (const dot of geo.dots) {
      expect(dot.breathe).toBe(1);
      expect(dot.pulse).toBe(1);
      expect(dot.mix).toBe(0);
    }
  });

  it('feather culls the invisible left-edge dots and fades the bottom band', () => {
    const plain = computeGrid(1120, 840, 28);
    const feathered = computeGrid(1120, 840, 28, 10_000, true);

    // Culling removes the true-invisibles (the fade itself stays gradual)
    expect(feathered.dots.length).toBeLessThan(plain.dots.length);
    expect(feathered.dots.length).toBeGreaterThan(0);

    // No dot survives at near-zero alpha, and none in the far-left column
    const minX = Math.min(...feathered.dots.map((d) => d.x));
    expect(minX).toBeGreaterThan(1120 * 0.05);
    for (const dot of feathered.dots) {
      expect(dot.baseA).toBeGreaterThanOrEqual(0.012);
    }

    // Bottom band fades: a bright-column dot near the bottom is dimmer than
    // the same column's dot in the field's core
    const right = feathered.dots.filter((d) => d.x > 1120 * 0.9);
    const core = right.find((d) => d.y > 840 * 0.5 && d.y < 840 * 0.7)!;
    const lowest = right.reduce((a, b) => (b.y > a.y ? b : a));
    expect(lowest.baseA).toBeLessThan(core.baseA);
  });
});

describe('rippleFalloff', () => {
  it('is full strength at the origin and zero at the radius edge', () => {
    expect(rippleFalloff(0, 280)).toBe(1);
    expect(rippleFalloff(280, 280)).toBe(0);
    expect(rippleFalloff(999, 280)).toBe(0);
  });

  it('decreases monotonically with distance', () => {
    const samples = [0, 70, 140, 210, 280].map((d) => rippleFalloff(d, 280));
    for (let i = 1; i < samples.length; i++) {
      expect(samples[i]).toBeLessThan(samples[i - 1]);
    }
  });

  it('Infinity radius disables attenuation (field-wide external pulses)', () => {
    expect(rippleFalloff(0, Infinity)).toBe(1);
    expect(rippleFalloff(5000, Infinity)).toBe(1);
  });

  it('degenerate radius produces no ripple', () => {
    expect(rippleFalloff(0, 0)).toBe(0);
    expect(rippleFalloff(10, -5)).toBe(0);
  });
});

describe('ripple waves', () => {
  const origin = (geo: ReturnType<typeof computeGrid>) => {
    const idx = nearestDotIndex(geo, 140, 140);
    return { idx, x: geo.dots[idx].x, y: geo.dots[idx].y };
  };

  it('excludes dots under the amplitude floor from the wave', () => {
    const geo = computeGrid(560, 560, 28);
    const o = origin(geo);
    const wave = makeRippleWave(geo.dots, o.x, o.y, 280, 0.35, 1, 0);
    for (let i = 0; i < geo.dots.length; i++) {
      const d = Math.hypot(geo.dots[i].x - o.x, geo.dots[i].y - o.y);
      const a = rippleFalloff(d, 280);
      if (a > RIPPLE_AMP_FLOOR) expect(wave.amp[i]).toBeCloseTo(a, 5);
      else expect(wave.amp[i]).toBe(0);
    }
  });

  it('Infinity radius reaches every dot at full amplitude (external pulses)', () => {
    const geo = computeGrid(280, 280, 28);
    const wave = makeRippleWave(geo.dots, 0, 0, Infinity, 0.35, 1.5, 0);
    expect([...wave.amp].every((a) => a === 1)).toBe(true);
    expect(wave.pulseGain).toBeCloseTo(1.8);
    expect(wave.mixGain).toBe(1);
  });

  it('the swell peaks at the origin around the rise time and settles to baseline', () => {
    const geo = computeGrid(560, 560, 28);
    const o = origin(geo);
    const wave = makeRippleWave(geo.dots, o.x, o.y, 280, 0.35, 1, 0);

    // Before the wavefront arrives anywhere: baseline
    applyRippleWaves(geo.dots, [wave], 0);
    expect(geo.dots[o.idx].pulse).toBe(1);

    // At the rise peak the origin dot carries the full gain (amp 1)
    applyRippleWaves(geo.dots, [wave], 160);
    expect(geo.dots[o.idx].pulse).toBeCloseTo(1 + 1.2, 1);
    expect(geo.dots[o.idx].mix).toBeGreaterThan(0.7);

    // A distant dot's local clock lags by dist × speed
    const far = geo.dots.findIndex(
      (d) => wave.amp[geo.dots.indexOf(d)] > 0 && Math.hypot(d.x - o.x, d.y - o.y) > 150
    );
    applyRippleWaves(geo.dots, [wave], 160 + wave.dist[far] * 0.35);
    expect(geo.dots[far].pulse).toBeGreaterThan(1.05);

    // Fully decayed: everything back at baseline, wave reported dead
    const live = applyRippleWaves(geo.dots, [wave], wave.lifespan + 1);
    expect(live).toBe(0);
    for (const dot of geo.dots) {
      expect(dot.pulse).toBe(1);
      expect(dot.mix).toBe(0);
    }
  });

  it('overlapping waves compose by max — the strongest local swell wins', () => {
    const geo = computeGrid(560, 560, 28);
    const o = origin(geo);
    const big = makeRippleWave(geo.dots, o.x, o.y, 280, 0.35, 1.6, 0);
    const small = makeRippleWave(geo.dots, o.x, o.y, 280, 0.35, 0.5, 0);
    applyRippleWaves(geo.dots, [small, big], 160);
    expect(geo.dots[o.idx].pulse).toBeCloseTo(1 + 1.2 * 1.6, 1);
  });

  it('wave lifespan covers the farthest dot’s delay plus the envelope', () => {
    const geo = computeGrid(560, 560, 28);
    const o = origin(geo);
    const wave = makeRippleWave(geo.dots, o.x, o.y, 280, 0.35, 1, 0);
    let maxDelay = 0;
    for (let i = 0; i < geo.dots.length; i++) {
      if (wave.amp[i] > 0) maxDelay = Math.max(maxDelay, wave.dist[i] * 0.35);
    }
    expect(wave.lifespan).toBeCloseTo(maxDelay + RIPPLE_LIFE_MS, 5);
  });
});

describe('nearestDotIndex', () => {
  it('returns -1 for an empty grid', () => {
    expect(nearestDotIndex(computeGrid(0, 0), 10, 10)).toBe(-1);
  });

  it('finds the dot under the pointer', () => {
    const geo = computeGrid(280, 280, 28);
    const idx = nearestDotIndex(geo, geo.dots[33].x + 3, geo.dots[33].y - 3);
    expect(idx).toBe(33);
  });

  it('clamps out-of-bounds points to the grid edge', () => {
    const geo = computeGrid(280, 280, 28);
    expect(nearestDotIndex(geo, -999, -999)).toBe(0);
    expect(nearestDotIndex(geo, 9999, 9999)).toBe(geo.dots.length - 1);
  });
});
