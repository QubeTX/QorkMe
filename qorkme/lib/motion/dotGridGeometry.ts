/**
 * DotGrid geometry — pure module, unit-tested.
 *
 * The mockup ramp: dots grow and brighten along the top-left → bottom-right
 * diagonal. Baselines are static; anime.js animates only the multiplier
 * channels (`breathe` for the idle loop, `pulse`/`mix` for ripples) so the
 * idle animation and ripples never fight over the same tween values.
 * Render: radius = baseR * breathe * pulse.
 *
 * With `feather` enabled the field fades to alpha 0 toward the left edge and
 * across the bottom band (no hard cutoffs — it dissolves into the content
 * column and the next section). Fully transparent dots are CULLED from the
 * array: anime.js never ticks them and the blitter never paints them. All
 * choreography uses distance-based delay functions, so culling is safe
 * (no reliance on a complete row-major lattice).
 */

export type Dot = {
  x: number;
  y: number;
  /** Static baseline radius (px), ramped 1.0 → 2.6 toward bottom-right. */
  baseR: number;
  /** Static baseline alpha (includes feathering). */
  baseA: number;
  /** Static color-ramp position (0 = blue, 1 = purple). */
  baseMix: number;
  /** Idle-loop multiplier channel (anime.js). */
  breathe: number;
  /** Ripple multiplier channel (anime.js). */
  pulse: number;
  /** Transient color flash channel (anime.js). */
  mix: number;
  /** Entrance scale channel (anime.js). */
  scale: number;
  /** Entrance alpha channel (anime.js). */
  alpha: number;
};

export type DotGridGeometry = {
  dots: Dot[];
  cols: number;
  rows: number;
  pitch: number;
  offsetX: number;
  offsetY: number;
  width: number;
  height: number;
};

export const DOT_PITCH = 28;
export const MAX_DOTS = 1400;

const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const smoothstep = (edge0: number, edge1: number, v: number) => {
  const t = clamp01((v - edge0) / (edge1 - edge0));
  return t * t * (3 - 2 * t);
};

function buildDots(
  width: number,
  height: number,
  pitch: number,
  feather: boolean
): { dots: Dot[]; cols: number; rows: number; offsetX: number; offsetY: number } {
  const cols = Math.max(1, Math.floor(width / pitch));
  const rows = Math.max(1, Math.floor(height / pitch));
  const offsetX = (width - (cols - 1) * pitch) / 2;
  const offsetY = (height - (rows - 1) * pitch) / 2;

  const dots: Dot[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const tx = cols === 1 ? 1 : c / (cols - 1);
      const ty = rows === 1 ? 1 : r / (rows - 1);
      const t = clamp01(tx * 0.5 + ty * 0.5);

      let alphaShape = 1;
      if (feather) {
        // Dissolve toward the left edge and through the bottom band
        alphaShape = smoothstep(0.04, 0.52, tx) * (1 - smoothstep(0.74, 1, ty));
      }
      const baseA = (0.12 + 0.43 * t) * alphaShape;
      if (baseA < 0.012) continue; // cull: never ticked, never painted

      dots.push({
        x: offsetX + c * pitch,
        y: offsetY + r * pitch,
        baseR: 1 + 1.6 * t,
        baseA,
        baseMix: t,
        breathe: 1,
        pulse: 1,
        mix: 0,
        scale: 1,
        alpha: 1,
      });
    }
  }
  return { dots, cols, rows, offsetX, offsetY };
}

/**
 * Builds a centered grid for the given box. If the (post-cull) dot count
 * would exceed `maxDots`, the pitch widens until it fits (frame-budget knob).
 */
export function computeGrid(
  width: number,
  height: number,
  pitch = DOT_PITCH,
  maxDots = MAX_DOTS,
  feather = false
): DotGridGeometry {
  if (width <= 0 || height <= 0) {
    return { dots: [], cols: 0, rows: 0, pitch, offsetX: 0, offsetY: 0, width: 0, height: 0 };
  }

  let p = pitch;
  let built = buildDots(width, height, p, feather);
  while (built.dots.length > maxDots) {
    p += 4;
    built = buildDots(width, height, p, feather);
  }

  return { ...built, pitch: p, width, height };
}

/**
 * Ripple amplitude falloff — 1 at the origin, easing to 0 at `radius`
 * (smoothstep), so pointer ripples are a local swell around the cursor
 * instead of a field-wide flash. `radius: Infinity` disables attenuation
 * (external pulses sweep the whole field at full strength).
 */
export function rippleFalloff(dist: number, radius: number): number {
  if (radius === Infinity) return 1;
  if (radius <= 0) return 0;
  return 1 - smoothstep(0, radius, dist);
}

/* =============================================================================
   RIPPLE WAVES — the pointer/tap/pulse swell as pure math.

   Ripples used to be per-dot anime tween bursts (~600 keyframed tweens per
   pointer event). anime's instance creation + composition bookkeeping made
   every move ripple cost ~8ms and taps 36–108ms of synchronous handler
   time — the interaction lag. A ripple is now ONE wave object created per
   event (a single O(dots) distance scan, ~0.1ms); the blitter evaluates
   pulse/mix per frame from these pure functions. The trajectory math is the
   same as the old tweens: amplitude = rippleFalloff, per-dot start delay =
   distance × speed, envelope = 160ms out(2) rise then an elastic settle
   (pulse) / house-bezier fade (mix), sampled into LUTs at build time.

   Overlapping waves compose by MAX per channel — the strongest local swell
   wins, which matches the old per-target tween replacement (the newest
   ripple dominates near the cursor; the trail keeps decaying naturally).
   ============================================================================= */

/** Pulse envelope: 160ms rise + 520ms elastic settle. */
const PULSE_RISE_MS = 160;
const PULSE_SETTLE_MS = 520;
/** Mix envelope: 160ms rise + 600ms fade. */
const MIX_RISE_MS = 160;
const MIX_SETTLE_MS = 600;
/** A wave contributes nothing after this much local time. */
export const RIPPLE_LIFE_MS = Math.max(
  PULSE_RISE_MS + PULSE_SETTLE_MS,
  MIX_RISE_MS + MIX_SETTLE_MS
);
/** Swells under this falloff are invisible — exclude the dot from the wave. */
export const RIPPLE_AMP_FLOOR = 0.06;

const LUT_STEP_MS = 2;
const LUT_LEN = Math.ceil(RIPPLE_LIFE_MS / LUT_STEP_MS) + 1;

/** anime's out(2): 1 − (1 − u)². */
const out2 = (u: number) => 1 - (1 - u) * (1 - u);

/** anime's outElastic(1, .6). */
function outElastic(u: number, amplitude = 1, period = 0.6): number {
  if (u === 0) return 0;
  if (u >= 1) return 1;
  return amplitude * 2 ** (-10 * u) * Math.sin(((u - period / 4) * (Math.PI * 2)) / period) + 1;
}

/** cubic-bezier(x1, y1, x2, y2) y-for-x via bisection — LUT build only. */
function cubicBezierY(x1: number, y1: number, x2: number, y2: number, x: number): number {
  if (x <= 0) return 0;
  if (x >= 1) return 1;
  const sample = (t: number, a: number, b: number) =>
    3 * t * (1 - t) * (1 - t) * a + 3 * t * t * (1 - t) * b + t * t * t;
  let lo = 0;
  let hi = 1;
  let t = x;
  for (let i = 0; i < 24; i++) {
    const cx = sample(t, x1, x2);
    if (Math.abs(cx - x) < 1e-5) break;
    if (cx < x) lo = t;
    else hi = t;
    t = (lo + hi) / 2;
  }
  return sample(t, y1, y2);
}

function buildEnvelopeLUT(
  riseMs: number,
  settleMs: number,
  settle: (u: number) => number
): Float32Array {
  const lut = new Float32Array(LUT_LEN);
  for (let i = 0; i < LUT_LEN; i++) {
    const t = i * LUT_STEP_MS;
    if (t < riseMs) {
      lut[i] = out2(t / riseMs);
    } else if (t < riseMs + settleMs) {
      lut[i] = 1 - settle((t - riseMs) / settleMs);
    } else {
      lut[i] = 0;
    }
  }
  return lut;
}

/** The mix rise uses the house bezier, not out(2) — override the rise band. */
function buildMixLUT(): Float32Array {
  const lut = buildEnvelopeLUT(MIX_RISE_MS, MIX_SETTLE_MS, (u) => cubicBezierY(0.25, 1, 0.5, 1, u));
  for (let i = 0; i * LUT_STEP_MS < MIX_RISE_MS; i++) {
    lut[i] = cubicBezierY(0.25, 1, 0.5, 1, (i * LUT_STEP_MS) / MIX_RISE_MS);
  }
  return lut;
}

const PULSE_LUT = buildEnvelopeLUT(PULSE_RISE_MS, PULSE_SETTLE_MS, (u) => outElastic(u));
const MIX_LUT = buildMixLUT();

export type RippleWave = {
  /** Caller-clock timestamp the wave was born. */
  start: number;
  /** ms of per-dot start delay per px of distance. */
  speed: number;
  /** Peak pulse contribution at the origin (1.2 × strength). */
  pulseGain: number;
  /** Peak mix contribution at the origin (min(1, 0.8 × strength)). */
  mixGain: number;
  /** Per-dot distance from the origin, index-aligned with the dot array. */
  dist: Float32Array;
  /** Per-dot falloff amplitude (0 = the wave never touches this dot). */
  amp: Float32Array;
  /** Wave is fully decayed after start + lifespan. */
  lifespan: number;
};

/** One O(dots) scan per event — this replaces ~600 anime tween creations. */
export function makeRippleWave(
  dots: Dot[],
  ox: number,
  oy: number,
  radius: number,
  speed: number,
  strength: number,
  start: number
): RippleWave {
  const dist = new Float32Array(dots.length);
  const amp = new Float32Array(dots.length);
  let maxDelay = 0;
  for (let i = 0; i < dots.length; i++) {
    const d = Math.hypot(dots[i].x - ox, dots[i].y - oy);
    const a = rippleFalloff(d, radius);
    if (a > RIPPLE_AMP_FLOOR) {
      dist[i] = d;
      amp[i] = a;
      const delay = d * speed;
      if (delay > maxDelay) maxDelay = delay;
    }
  }
  return {
    start,
    speed,
    pulseGain: 1.2 * strength,
    mixGain: Math.min(1, 0.8 * strength),
    dist,
    amp,
    lifespan: maxDelay + RIPPLE_LIFE_MS,
  };
}

/**
 * Evaluate every live wave into the dots' pulse/mix channels for `now`.
 * Resets both channels first, so it must run once more after the last wave
 * dies to land the field back at baseline. Returns the live-wave count
 * (callers prune their array when it hits 0).
 */
export function applyRippleWaves(dots: Dot[], waves: RippleWave[], now: number): number {
  let live = 0;
  for (let i = 0; i < dots.length; i++) {
    dots[i].pulse = 1;
    dots[i].mix = 0;
  }
  for (const wave of waves) {
    const age = now - wave.start;
    if (age < 0 || age > wave.lifespan) continue;
    live++;
    const { dist, amp, speed, pulseGain, mixGain } = wave;
    for (let i = 0; i < dots.length; i++) {
      const a = amp[i];
      if (a === 0) continue;
      const tLocal = age - dist[i] * speed;
      if (tLocal <= 0 || tLocal >= RIPPLE_LIFE_MS) continue;
      const idx = (tLocal / LUT_STEP_MS) | 0;
      const p = pulseGain * a * PULSE_LUT[idx];
      const m = mixGain * a * MIX_LUT[idx];
      const dot = dots[i];
      if (1 + p > dot.pulse) dot.pulse = 1 + p;
      if (m > dot.mix) dot.mix = m;
    }
  }
  return live;
}

/** Index of the dot nearest to a point — linear scan (cull-safe), pure math. */
export function nearestDotIndex(geo: DotGridGeometry, px: number, py: number): number {
  let best = -1;
  let bestDist = Infinity;
  for (let i = 0; i < geo.dots.length; i++) {
    const dx = geo.dots[i].x - px;
    const dy = geo.dots[i].y - py;
    const d = dx * dx + dy * dy;
    if (d < bestDist) {
      bestDist = d;
      best = i;
    }
  }
  return best;
}
