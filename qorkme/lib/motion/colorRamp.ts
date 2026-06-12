/**
 * Precomputed color ramp — pure module, unit-tested.
 *
 * The DotGrid renderer looks colors up here instead of doing per-frame
 * color math or building rgba() strings in the draw loop (alpha goes
 * through ctx.globalAlpha).
 */

export function hexToRgb(hex: string): [number, number, number] {
  const clean = hex.replace('#', '');
  const full =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const n = parseInt(full, 16);
  return [(n >> 16) & 0xff, (n >> 8) & 0xff, n & 0xff];
}

/** `steps` CSS color strings lerped from `from` to `to`. */
export function buildColorRamp(from: string, to: string, steps = 256): string[] {
  const [r1, g1, b1] = hexToRgb(from);
  const [r2, g2, b2] = hexToRgb(to);
  return Array.from({ length: steps }, (_, i) => {
    const t = steps === 1 ? 0 : i / (steps - 1);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  });
}

/** Maps t∈[0,1] to a ramp index, clamped. */
export function rampIndex(t: number, size = 256): number {
  const clamped = t < 0 ? 0 : t > 1 ? 1 : t;
  return Math.min(size - 1, Math.round(clamped * (size - 1)));
}
