import { describe, it, expect } from 'vitest';
import { hexToRgb, buildColorRamp, rampIndex } from '../colorRamp';

describe('hexToRgb', () => {
  it('parses 6-digit hex', () => {
    expect(hexToRgb('#0066FF')).toEqual([0, 102, 255]);
    expect(hexToRgb('#7c3aed')).toEqual([124, 58, 237]);
  });

  it('parses 3-digit hex', () => {
    expect(hexToRgb('#fff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000')).toEqual([0, 0, 0]);
  });
});

describe('buildColorRamp', () => {
  it('starts at from and ends at to', () => {
    const ramp = buildColorRamp('#0066FF', '#7c3aed', 256);
    expect(ramp).toHaveLength(256);
    expect(ramp[0]).toBe('rgb(0,102,255)');
    expect(ramp[255]).toBe('rgb(124,58,237)');
  });

  it('interpolates monotonically on the red channel (blue → purple)', () => {
    const ramp = buildColorRamp('#0066FF', '#7c3aed', 16);
    const reds = ramp.map((c) => parseInt(c.slice(4), 10));
    for (let i = 1; i < reds.length; i++) {
      expect(reds[i]).toBeGreaterThanOrEqual(reds[i - 1]);
    }
  });
});

describe('rampIndex', () => {
  it('maps and clamps t to the ramp range', () => {
    expect(rampIndex(0)).toBe(0);
    expect(rampIndex(1)).toBe(255);
    expect(rampIndex(0.5)).toBe(128);
    expect(rampIndex(-1)).toBe(0);
    expect(rampIndex(2)).toBe(255);
  });
});
