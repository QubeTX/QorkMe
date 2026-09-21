import { subscribe } from '@/lib/pretext/resizeCoordinator';
import { createTicker, type EffectController } from './lifecycle';

// Bayer ordering and the changing character register are adapted from
// ObsidianUI Dither Canvas (MIT); our source is procedural, never remote video.
const bayer = [0, 8, 2, 10, 12, 4, 14, 6, 3, 11, 1, 9, 15, 7, 13, 5];
const chars = 'QORK.ME';

export function createCanvasRenderer(
  canvas: HTMLCanvasElement,
  region: HTMLElement
): EffectController {
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas unavailable');
  let width = 1;
  let height = 1;
  let paused = false;
  let pointer = { x: -1000, y: -1000, vx: 0, vy: 0 };
  let timeNow = 0;
  let pulseTime = -100;
  const columns = 106;
  let rows = 1;
  let vx = new Float32Array(columns);
  let vy = new Float32Array(columns);
  const ticker = createTicker((time) => {
    timeNow = time;
    ctx.clearRect(0, 0, width, height);
    const cell = width / columns;
    const beat = Math.max(0, 1 - (time - pulseTime) / 1.4);
    ctx.font = `${Math.max(6, cell * 0.92)}px monospace`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    for (let y = 0; y < rows; y++)
      for (let x = 0; x < columns; x++) {
        const index = y * columns + x;
        const px = (x + 0.5) * cell;
        const py = (y + 0.5) * cell;
        const dx = px - pointer.x;
        const dy = py - pointer.y;
        const distance = Math.hypot(dx, dy);
        const influence = Math.exp((-distance * distance) / 8500);
        if (!paused) {
          vx[index] = (vx[index] + pointer.vx * influence * 0.09) * 0.94;
          vy[index] = (vy[index] + pointer.vy * influence * 0.09) * 0.94;
        }
        const u = px / width;
        const v = py / height;
        const ex = (u - 0.5) * 2;
        const ey = (v - 0.5) * 2;
        const edge =
          Math.max(0, 1 - Math.pow(Math.abs(ex), 4)) * Math.max(0, 1 - Math.pow(Math.abs(ey), 4));
        const central = 0.25 + Math.min(1, Math.abs(ex) * 1.7 + Math.abs(ey) * 0.85) * 0.75;
        const wave =
          Math.sin(u * 12 + Math.sin(v * 7 + time * 0.22) * 1.5 + time * 0.2 + vx[index] * 0.018) *
            0.5 +
          0.5;
        const signal =
          (wave * 0.65 + (Math.sin(v * 13 - u * 4 - time * 0.23) * 0.5 + 0.5) * 0.35) * edge;
        const threshold = bayer[(y % 4) * 4 + (x % 4)] / 16;
        const pulse =
          Math.exp(-Math.pow((Math.hypot(ex, ey * 0.6) - (1 - beat) * 1.1) * 8, 2)) * beat;
        const alpha = edge * central * (0.08 + signal * 0.5 + influence * 0.25 + pulse * 0.25);
        if (signal < threshold * 0.78) continue;
        ctx.fillStyle =
          x / columns > 0.65 ? `rgba(111,64,225,${alpha})` : `rgba(38,99,225,${alpha})`;
        const ox = px + vx[index];
        const oy = py + vy[index];
        if (signal < 0.48) {
          ctx.beginPath();
          ctx.arc(ox, oy, 0.65 + signal, 0, Math.PI * 2);
          ctx.fill();
        } else ctx.fillText(chars[(x + y + Math.floor(time * 1.2)) % chars.length], ox, oy);
      }
    pointer.vx *= 0.5;
    pointer.vy *= 0.5;
  }, 30);
  const resize = () => {
    const box = canvas.getBoundingClientRect();
    width = box.width;
    height = box.height;
    rows = Math.ceil(height / Math.max(1, width / columns));
    if (vx.length !== columns * rows) {
      vx = new Float32Array(columns * rows);
      vy = new Float32Array(columns * rows);
    }
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    canvas.width = Math.max(1, Math.round(width * dpr));
    canvas.height = Math.max(1, Math.round(height * dpr));
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ticker.redraw();
  };
  const move = (e: PointerEvent) => {
    if (paused) return;
    const box = canvas.getBoundingClientRect();
    const x = e.clientX - box.left;
    const y = e.clientY - box.top;
    pointer = {
      x,
      y,
      vx: Math.max(-35, Math.min(35, x - pointer.x)),
      vy: Math.max(-35, Math.min(35, y - pointer.y)),
    };
  };
  const leave = () => {
    if (!paused) pointer = { x: -1000, y: -1000, vx: 0, vy: 0 };
  };
  region.addEventListener('pointermove', move, { passive: true });
  region.addEventListener('pointerdown', move, { passive: true });
  region.addEventListener('pointerleave', leave);
  const unsubscribe = subscribe(resize);
  resize();
  return {
    pause(value) {
      paused = value;
      ticker.pause(value);
    },
    pulse() {
      if (!paused) pulseTime = timeNow;
    },
    dispose() {
      ticker.dispose();
      unsubscribe();
      region.removeEventListener('pointermove', move);
      region.removeEventListener('pointerdown', move);
      region.removeEventListener('pointerleave', leave);
    },
  };
}
