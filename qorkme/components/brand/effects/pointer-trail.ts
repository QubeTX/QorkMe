import { subscribe } from '@/lib/pretext/resizeCoordinator';
import { bayer, chars } from './dither-pattern';
import { createTicker } from './lifecycle';

const lifetime = 850;
const cell = 11;
const maxPoints = 48;
type Point = { x: number; y: number; born: number };

/** A finite wake, with no animation work once the pointer's last mark fades. */
export function createPointerTrail(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  let width = 1;
  let height = 1;
  let columns = 1;
  let points: Point[] = [];
  let target: Point | null = null;
  let head: Point | null = null;
  let running = false;

  const ticker = createTicker(() => {
    const now = performance.now();
    ctx.clearRect(0, 0, width, height);
    points = points.filter((point) => now - point.born < lifetime);

    // Ease a little behind the real pointer; keep the native cursor untouched.
    if (target && head && now - target.born < 160) {
      const dx = target.x - head.x;
      const dy = target.y - head.y;
      if (Math.hypot(dx, dy) > 2) {
        const next = { x: head.x + dx * 0.42, y: head.y + dy * 0.42, born: now };
        const steps = Math.min(12, Math.max(1, Math.ceil((Math.hypot(dx, dy) * 0.42) / 14)));
        for (let i = 1; i <= steps; i++) {
          points.push({
            x: head.x + ((next.x - head.x) * i) / steps,
            y: head.y + ((next.y - head.y) * i) / steps,
            born: now,
          });
        }
        head = next;
      }
    }
    if (points.length > maxPoints) points.splice(0, points.length - maxPoints);
    if (!points.length) {
      running = false;
      head = target = null;
      canvas.dataset.trailState = 'idle';
      ticker.pause(true);
      return;
    }

    // Merge nearby stamps using maximum intensity, so slow movement never
    // builds up an opaque patch. Only visit cells touched by the small wake.
    const field = new Map<number, number>();
    for (const point of points) {
      const age = (now - point.born) / lifetime;
      const radius = 48 + age * 24;
      const fade = (1 - age) ** 1.6;
      const x0 = Math.max(0, Math.floor((point.x - radius) / cell));
      const x1 = Math.min(columns - 1, Math.ceil((point.x + radius) / cell));
      const y0 = Math.max(0, Math.floor((point.y - radius) / cell));
      const y1 = Math.min(Math.ceil(height / cell) - 1, Math.ceil((point.y + radius) / cell));
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const distance = Math.hypot((x + 0.5) * cell - point.x, (y + 0.5) * cell - point.y);
          const strength = Math.max(0, 1 - distance / radius) ** 1.3 * fade;
          const index = y * columns + x;
          if (strength > (field.get(index) ?? 0)) field.set(index, strength);
        }
      }
    }
    ctx.font = '9px monospace';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (const [index, strength] of field) {
      const x = index % columns;
      const y = Math.floor(index / columns);
      const threshold = (bayer[(y % 4) * 4 + (x % 4)] + 1) / 17;
      if (strength < threshold * 0.7) continue;
      const alpha = strength * 0.36;
      ctx.fillStyle = (x + y) % 5 < 2 ? `rgba(111,64,225,${alpha})` : `rgba(38,99,225,${alpha})`;
      const px = (x + 0.5) * cell;
      const py = (y + 0.5) * cell;
      if (strength > 0.46 && (x + y) % 3 !== 0) {
        ctx.fillText(chars[(x + y * 3) % chars.length], px, py);
      } else {
        ctx.fillRect(px, py, 1.2, 1.2);
      }
    }
  }, 30);

  const clear = () => {
    running = false;
    points = [];
    head = target = null;
    ticker.pause(true);
    ctx.clearRect(0, 0, width, height);
    canvas.dataset.trailState = 'idle';
  };
  const resize = () => {
    width = window.innerWidth;
    height = window.innerHeight;
    columns = Math.ceil(width / cell);
    // Bound both density and total backing pixels, including large monitors.
    const dpr = Math.min(devicePixelRatio || 1, 1.25, Math.sqrt(2_000_000 / (width * height)));
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    clear();
  };
  const move = (event: PointerEvent) => {
    if (event.pointerType !== 'mouse' || event.buttons || document.hidden) return;
    const now = performance.now();
    if (target && event.clientX === target.x && event.clientY === target.y) return;
    target = { x: event.clientX, y: event.clientY, born: now };
    if (!head) {
      head = { ...target };
      points.push({ ...target });
    }
    canvas.dataset.trailState = 'active';
    if (!running) {
      running = true;
      ticker.pause(false);
    }
  };
  const leave = (event: PointerEvent) => {
    if (!event.relatedTarget) target = null;
  };
  const visibility = () => {
    if (document.hidden) clear();
  };
  resize();
  const unsubscribe = subscribe(resize);
  window.addEventListener('pointermove', move, { passive: true });
  window.addEventListener('pointerout', leave, { passive: true });
  window.addEventListener('blur', clear);
  window.addEventListener('scroll', clear, { passive: true, capture: true });
  window.addEventListener('keydown', clear);
  document.addEventListener('visibilitychange', visibility);
  return {
    dispose() {
      clear();
      ticker.dispose();
      unsubscribe();
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerout', leave);
      window.removeEventListener('blur', clear);
      window.removeEventListener('scroll', clear, true);
      window.removeEventListener('keydown', clear);
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}
