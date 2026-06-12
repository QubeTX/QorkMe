/**
 * Framework-free cursor physics. Same visual design as the original
 * three-layer cursor (dot / trailing ring / ambient bloom), rebuilt:
 *
 * - single rAF loop, transform-only writes (centering folded in — no
 *   width/height/margin mutation, no layout)
 * - delta-time-normalized lerp: identical trailing feel at 60/120/144Hz
 * - settle detection: the loop CANCELS when everything converges — idle
 *   cost is zero (the original ran forever)
 * - velocity-aligned squash/stretch on the ring (cash.app physicality)
 * - press squash, interactive enlarge, magnetic ring-docking — all through
 *   the same transform pipeline
 * - zero per-event allocation (mutates preallocated state)
 *
 * Unit-testable: construct with stub elements and call tick() manually.
 */

export type CursorMode = 'default' | 'interactive' | 'magnetic' | 'text';

type Vec = { x: number; y: number };

const RING_K = 0.32;
const BLOOM_K = 0.22;
const SCALE_K = 0.4;
const SETTLE = 0.05;

const MODE_SCALE: Record<CursorMode, number> = {
  default: 1,
  interactive: 1.5,
  magnetic: 1.4,
  text: 0.7,
};

/** Frame-rate-independent lerp factor: k per 60Hz frame → k' for dt. */
export function dtLerp(k: number, dtSeconds: number): number {
  return 1 - Math.pow(1 - k, dtSeconds * 60);
}

export class CursorEngine {
  private pointer: Vec = { x: 0, y: 0 };
  private ring: Vec = { x: 0, y: 0 };
  private bloom: Vec = { x: 0, y: 0 };
  private magnet: Vec | null = null;
  private mode: CursorMode = 'default';
  private pressed = false;
  private scale = 1;
  private raf: number | null = null;
  private last = 0;
  private visible = false;
  private disposed = false;

  constructor(
    private dotEl: HTMLElement,
    private ringEl: HTMLElement,
    private bloomEl: HTMLElement
  ) {
    if (typeof window !== 'undefined') {
      this.pointer.x = this.ring.x = this.bloom.x = window.innerWidth / 2;
      this.pointer.y = this.ring.y = this.bloom.y = window.innerHeight / 2;
    }
  }

  move(x: number, y: number): void {
    this.pointer.x = x;
    this.pointer.y = y;
    if (!this.visible) this.setVisible(true);
    this.start();
  }

  press(down: boolean): void {
    this.pressed = down;
    this.start();
  }

  setMode(mode: CursorMode, magnetEl?: Element | null): void {
    this.mode = mode;
    if (mode === 'magnetic' && magnetEl) {
      const rect = magnetEl.getBoundingClientRect();
      this.magnet = { x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 };
    } else {
      this.magnet = null;
    }
    this.ringEl.dataset.mode = mode;
    this.dotEl.dataset.mode = mode;
    this.start();
  }

  hide(): void {
    this.setVisible(false);
    this.setMode('default');
  }

  private setVisible(visible: boolean): void {
    this.visible = visible;
    this.dotEl.style.opacity = visible ? '1' : '0';
    this.ringEl.style.opacity = visible ? '1' : '0';
    this.bloomEl.style.opacity = visible ? '0.4' : '0';
  }

  start(): void {
    if (this.raf == null && !this.disposed && typeof requestAnimationFrame !== 'undefined') {
      this.last = performance.now();
      this.raf = requestAnimationFrame(this.loop);
    }
  }

  private loop = (now: number): void => {
    this.raf = null;
    if (this.disposed) return;
    const settled = this.tick(Math.min((now - this.last) / 1000, 0.05));
    this.last = now;
    if (!settled) this.raf = requestAnimationFrame(this.loop);
  };

  /** One physics step. Returns true once fully settled (loop may stop). */
  tick(dt: number): boolean {
    const { pointer, ring, bloom } = this;

    // Magnetic mode: the ring docks toward the element center while the
    // dot keeps tracking the true pointer
    const rtx = this.magnet ? pointer.x + (this.magnet.x - pointer.x) * 0.65 : pointer.x;
    const rty = this.magnet ? pointer.y + (this.magnet.y - pointer.y) * 0.65 : pointer.y;

    const kRing = dtLerp(RING_K, dt);
    const kBloom = dtLerp(BLOOM_K, dt);
    const kScale = dtLerp(SCALE_K, dt);

    const prx = ring.x;
    const pry = ring.y;
    ring.x += (rtx - ring.x) * kRing;
    ring.y += (rty - ring.y) * kRing;
    bloom.x += (pointer.x - bloom.x) * kBloom;
    bloom.y += (pointer.y - bloom.y) * kBloom;

    // Velocity-aligned squash/stretch from the ring's own motion
    const vx = (ring.x - prx) / Math.max(dt, 1e-6);
    const vy = (ring.y - pry) / Math.max(dt, 1e-6);
    const speed = Math.hypot(vx, vy);
    const stretch = Math.min(0.35, speed * 0.00045);
    const angle = stretch > 0.01 ? Math.atan2(vy, vx) : 0;

    const targetScale = (this.pressed ? 0.85 : 1) * MODE_SCALE[this.mode];
    this.scale += (targetScale - this.scale) * kScale;

    this.dotEl.style.transform =
      `translate3d(${pointer.x}px, ${pointer.y}px, 0) translate(-50%, -50%) ` +
      `scale(${(this.pressed ? 0.8 : 1).toFixed(3)})`;
    this.ringEl.style.transform =
      `translate3d(${ring.x.toFixed(2)}px, ${ring.y.toFixed(2)}px, 0) translate(-50%, -50%) ` +
      `rotate(${angle.toFixed(3)}rad) ` +
      `scale(${(this.scale * (1 + stretch)).toFixed(3)}, ${(this.scale / (1 + stretch)).toFixed(3)})`;
    this.bloomEl.style.transform = `translate3d(${bloom.x.toFixed(2)}px, ${bloom.y.toFixed(2)}px, 0) translate(-50%, -50%)`;

    return (
      Math.abs(ring.x - rtx) < SETTLE &&
      Math.abs(ring.y - rty) < SETTLE &&
      Math.abs(bloom.x - pointer.x) < SETTLE &&
      Math.abs(bloom.y - pointer.y) < SETTLE &&
      Math.abs(this.scale - targetScale) < 0.005
    );
  }

  destroy(): void {
    this.disposed = true;
    if (this.raf != null && typeof cancelAnimationFrame !== 'undefined') {
      cancelAnimationFrame(this.raf);
      this.raf = null;
    }
  }
}
