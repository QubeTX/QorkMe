import { describe, it, expect } from 'vitest';
import { buildTrace, cubePaths } from '../scrollTracePath';

describe('cubePaths', () => {
  it('returns a hexagon outline plus three internal edges', () => {
    const paths = cubePaths(50, 100, 10);
    expect(paths).toHaveLength(4);
    expect(paths[0]).toMatch(/^M .* Z$/);
    for (const spoke of paths.slice(1)) {
      expect(spoke).toMatch(/^M 50 100 L /);
    }
  });
});

describe('buildTrace', () => {
  it('returns empty geometry for a degenerate span', () => {
    const geo = buildTrace({ junctions: [], startY: 100, endY: 100, gutterX: 60 });
    expect(geo.d).toBe('');
    expect(geo.cubes).toHaveLength(0);
  });

  it('places one cube per in-span junction at its span fraction', () => {
    const geo = buildTrace({
      junctions: [500, 1500, 99999],
      startY: 0,
      endY: 2000,
      gutterX: 60,
    });
    expect(geo.cubes).toHaveLength(2);
    expect(geo.cubes[0].at).toBeCloseTo(0.25);
    expect(geo.cubes[1].at).toBeCloseTo(0.75);
  });

  it('jogs across the lane at each junction (alternating x)', () => {
    const geo = buildTrace({
      junctions: [500, 1000],
      startY: 0,
      endY: 1500,
      gutterX: 60,
      amplitude: 14,
    });
    // Junction landings alternate between gutter±amplitude
    expect(geo.d).toContain('L 74 500');
    expect(geo.d).toContain('L 46 1000');
  });

  it('accumulates a plausible total length (≥ vertical span)', () => {
    const geo = buildTrace({ junctions: [500], startY: 0, endY: 1000, gutterX: 60 });
    expect(geo.length).toBeGreaterThanOrEqual(1000);
  });
});
