'use client';

import { useEffect, useRef, type FC } from 'react';
import { animate, utils } from '@/lib/motion/anime';
import { buildColorRamp, rampIndex } from '@/lib/motion/colorRamp';
import {
  applyRippleWaves,
  computeGrid,
  makeRippleWave,
  type DotGridGeometry,
  type RippleWave,
} from '@/lib/motion/dotGridGeometry';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { subscribe as subscribeResize } from '@/lib/pretext/resizeCoordinator';

/**
 * The hero dot-matrix field — fully anime.js-driven (replaces the R3F
 * DotMatrix). anime.js animates a flat array of plain dot objects
 * (breathe/pulse/mix channels); this component is just the Canvas 2D
 * blitter that paints whatever the engine computed.
 *
 * Optimization model:
 * - feathered geometry CULLS invisible dots — anime never ticks them
 * - all choreography uses distance-based delay functions (radially correct
 *   ripples, no dependence on a complete lattice)
 * - one paint loop, paused off-screen (IO); engine pauses on hidden tabs
 *
 * Interactions:
 * - window-level pointer move/down → elastic swell around the cursor,
 *   amplitude attenuated to 0 at MOVE_RADIUS/TAP_RADIUS (only dots in
 *   reach are retargeted, so the trail behind the cursor decays
 *   naturally). Listening on window matters: the field shows behind the
 *   fixed header and past the hero, where events never bubble through
 *   the hero subtree; the radius bound makes out-of-reach moves no-ops.
 * - window 'qubetx:pulse' CustomEvent {x, y, strength} → external ripple
 *   sweeping the full field (load-sequence beat, easter eggs, logo
 *   snap-back)
 *
 * The container is pointer-events:none (it may extend past the hero into
 * the next section and must never block clicks). Resize goes through the
 * shared resizeCoordinator (NO ResizeObserver — codebase law).
 * Reduced motion: static ramp, no loops, no ripples.
 */

export const PULSE_EVENT = 'qubetx:pulse';

export type PulseDetail = { x: number; y: number; strength?: number };

/** Fire a dot-field ripple from a viewport coordinate. */
export function firePulse(detail: PulseDetail) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(PULSE_EVENT, { detail }));
  }
}

// QorkMe divergence from the upstream kit: the field ramp runs sage -> bamboo
// (--gradient-brand) instead of QubeTX blue -> violet
const LUT = buildColorRamp('#4a9e5c', '#c4a876', 256);
const DPR_CAP = 1.5;
/** ms of delay per px of distance from the ripple origin */
const RIPPLE_SPEED = 0.35;
const IDLE_SPEED = 0.16;
const ENTRANCE_SPEED = 0.22;
/** px reach of a pointer-move swell (amplitude falls to 0 here) */
const MOVE_RADIUS = 280;
/** px reach of a tap splash */
const TAP_RADIUS = 460;
/** Active-wave cap — beyond this the oldest wave is dropped. */
const MAX_WAVES = 24;

type DotGridProps = {
  className?: string;
  /** Skip the corner entrance (used when remounting after resize). */
  entrance?: boolean;
};

const DotGrid: FC<DotGridProps> = ({ className, entrance = true }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // jsdom / very old browsers

    const reduced = prefersReducedMotion();
    let geo: DotGridGeometry = {
      dots: [],
      cols: 0,
      rows: 0,
      pitch: 28,
      offsetX: 0,
      offsetY: 0,
      width: 0,
      height: 0,
    };
    let raf: number | null = null;
    let visible = true;
    let idleAnim: ReturnType<typeof animate> | null = null;
    let disposed = false;
    let waves: RippleWave[] = [];

    const distDelay = (speed: number, ox: number, oy: number) => (_t: unknown, i: number) =>
      Math.hypot(geo.dots[i].x - ox, geo.dots[i].y - oy) * speed;

    const draw = () => {
      // Live ripple waves write the pulse/mix channels (pure math, ~0.02ms
      // per wave); the final evaluation that reports 0 live waves also
      // resets both channels to baseline, after which the pass is skipped.
      if (waves.length > 0) {
        const live = applyRippleWaves(geo.dots, waves, performance.now());
        if (live === 0) waves = [];
        else if (live < waves.length) {
          const now = performance.now();
          waves = waves.filter((w) => now - w.start <= w.lifespan);
        }
      }
      ctx.clearRect(0, 0, geo.width, geo.height);
      for (const dot of geo.dots) {
        const r = dot.baseR * dot.breathe * dot.pulse * dot.scale;
        if (r <= 0.05) continue;
        const alpha = Math.min(1, dot.baseA * dot.alpha + dot.mix * 0.3);
        if (alpha <= 0.01) continue;
        ctx.globalAlpha = alpha;
        ctx.fillStyle = LUT[rampIndex(dot.baseMix * 0.7 + dot.mix * 0.3)];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = null;
      if (!visible || disposed) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (raf == null && visible && !disposed) raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const sizeCanvas = () => {
      const rect = container.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(rect.width * dpr));
      canvas.height = Math.max(1, Math.round(rect.height * dpr));
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      return rect;
    };

    const startIdle = () => {
      if (reduced || geo.dots.length === 0) return;
      idleAnim = animate(geo.dots, {
        breathe: [
          { to: 1.14, duration: 1700, ease: 'inOutSine' },
          { to: 1, duration: 1700, ease: 'inOutSine' },
        ],
        loop: true,
        delay: distDelay(IDLE_SPEED, geo.width / 2, geo.height / 2),
      });
    };

    const build = (withEntrance: boolean) => {
      utils.remove(geo.dots);
      idleAnim = null;
      waves = []; // wave arrays are index-aligned to the old dot array
      const rect = sizeCanvas();
      geo = computeGrid(rect.width, rect.height, undefined, undefined, true);
      if (geo.dots.length === 0) return;

      if (reduced || !withEntrance) {
        draw();
        startIdle();
        return;
      }

      // Entrance: sweep in from the bottom-right (the ramp's bright corner)
      for (const dot of geo.dots) {
        dot.scale = 0;
        dot.alpha = 0;
      }
      animate(geo.dots, {
        scale: [0, 1],
        alpha: [0, 1],
        duration: 600,
        ease: 'out(3)',
        delay: distDelay(ENTRANCE_SPEED, geo.width, geo.height),
      }).then(() => {
        if (!disposed) startIdle();
      });
    };

    // A ripple is ONE wave object (single O(dots) distance scan, ~0.1ms) —
    // the blitter evaluates pulse/mix from the wave list each frame via
    // applyRippleWaves (same falloff, distance delay, and rise/elastic
    // envelopes as ever, in pure unit-tested math). Ripples used to be
    // per-dot anime tween bursts: ~600 keyframed tween creations per
    // pointer event cost ~8ms (taps 36ms+) of synchronous handler time —
    // THE interaction lag. anime still owns breathe/entrance; waves own
    // pulse/mix (one owner per channel, as always).
    const ripple = (ox: number, oy: number, strength = 1, radius = Infinity) => {
      if (reduced || geo.dots.length === 0) return;
      waves.push(
        makeRippleWave(geo.dots, ox, oy, radius, RIPPLE_SPEED, strength, performance.now())
      );
      if (waves.length > MAX_WAVES) waves.shift();
    };

    // Pointer → ripple, throttled by distance (≥16px) or time (≥45ms).
    // The old 24px/90ms gate existed because each ripple cost ~8ms of
    // tween churn; waves are ~0.1ms, so the swell can afford to track the
    // cursor twice as densely — this is what makes it feel attached
    // instead of trailing. lastPoint is in client coords so the throttle
    // runs before any getBoundingClientRect.
    const lastPoint = { x: -9999, y: -9999, t: 0 };
    const onPointer = (e: PointerEvent) => {
      const now = performance.now();
      const dx = e.clientX - lastPoint.x;
      const dy = e.clientY - lastPoint.y;
      if (e.type === 'pointermove' && dx * dx + dy * dy < 256 && now - lastPoint.t < 45) return;
      lastPoint.x = e.clientX;
      lastPoint.y = e.clientY;
      lastPoint.t = now;
      const rect = container.getBoundingClientRect();
      const down = e.type === 'pointerdown';
      ripple(
        e.clientX - rect.left,
        e.clientY - rect.top,
        down ? 1.6 : 1,
        down ? TAP_RADIUS : MOVE_RADIUS
      );
    };

    const onExternalPulse = (e: Event) => {
      const {
        x,
        y,
        strength = 1.5,
      } = (e as CustomEvent<PulseDetail>).detail ?? {
        x: 0,
        y: 0,
      };
      const rect = container.getBoundingClientRect();
      ripple(x - rect.left, y - rect.top, strength);
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            if (visible) {
              idleAnim?.play();
              startLoop();
            } else {
              idleAnim?.pause();
              stopLoop();
            }
          })
        : null;
    io?.observe(container);

    build(entrance);
    startLoop();

    // Pointer events are window-level: the field shows behind the fixed
    // header and extends ~26vh past the hero, and events over those regions
    // never bubble through the hero section (sibling subtrees). The ripple
    // radius makes a global listener self-limiting — a pointer out of reach
    // of every dot is a no-op.
    const unsubscribeResize = subscribeResize(() => build(false));
    window.addEventListener('pointermove', onPointer, { passive: true });
    window.addEventListener('pointerdown', onPointer, { passive: true });
    window.addEventListener(PULSE_EVENT, onExternalPulse);

    return () => {
      disposed = true;
      stopLoop();
      io?.disconnect();
      unsubscribeResize();
      window.removeEventListener('pointermove', onPointer);
      window.removeEventListener('pointerdown', onPointer);
      window.removeEventListener(PULSE_EVENT, onExternalPulse);
      utils.remove(geo.dots);
    };
  }, [entrance]);

  return (
    <div
      ref={containerRef}
      className={className}
      aria-hidden="true"
      style={{ pointerEvents: 'none' }}
    >
      <canvas ref={canvasRef} style={{ display: 'block' }} />
    </div>
  );
};

export default DotGrid;
