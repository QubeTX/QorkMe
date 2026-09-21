// Holographic Card renderer adapted from verified vgpu source (MIT, Vercel).
import { effect, frame, init, surface, type Gpu } from 'vgpu';
import { subscribe } from '@/lib/pretext/resizeCoordinator';
import { createTicker, type EffectController } from './lifecycle';
import { shader as source } from './shaders/hologram';

export async function createHologramRenderer(
  canvas: HTMLCanvasElement,
  region: HTMLElement,
  failed: (message: string) => void
): Promise<EffectController> {
  let gpu: Gpu | undefined;
  let remove = () => {};
  let disposed = false;
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    remove();
    gpu?.dispose();
  };
  try {
    const owner = await init({ powerPreference: 'low-power', label: 'qorkme-hologram' });
    gpu = owner;
    const output = surface(owner, canvas, { autoResize: false, alphaMode: 'premultiplied' });
    const shader = effect(owner, source, {
      set: {
        params: {
          resolution: [1, 1],
          center: [0.5, 0.5],
          tilt: [0, 0],
          pointer: [0.2, -0.25],
          hover: 0,
        },
      },
    });
    await shader.compile({ colors: [output.format] });
    let paused = false;
    let targetHover = 0;
    let pointerX = 0;
    let pointerY = 0;
    let tiltX = 0;
    let tiltY = 0;
    let hover = 0;
    let lightX = 0.2;
    let lightY = -0.25;
    const fail = () => {
      if (disposed) return;
      dispose();
      failed('Holographic WebGPU unavailable');
    };
    const ticker = createTicker((_time, delta) => {
      if (disposed) return;
      // Preserve upstream exponential easing, view tilt and light tracking.
      const blend = 1 - Math.exp(-10 * Math.min(delta, 0.1));
      const targetX = Math.max(-1, Math.min(1, pointerX)) * 0.16 * targetHover;
      const targetY = -Math.max(-1, Math.min(1, pointerY)) * 0.12 * targetHover;
      tiltX += (targetX - tiltX) * blend;
      tiltY += (targetY - tiltY) * blend;
      hover += (targetHover - hover) * blend;
      if (targetHover > 0) {
        lightX += (pointerX - lightX) * blend;
        lightY += (pointerY - lightY) * blend;
      }
      shader.set({
        params: {
          resolution: output.size,
          center: [
            Number(canvas.dataset.inkCenterX ?? 0.5),
            Number(canvas.dataset.inkCenterY ?? 0.5),
          ],
          tilt: [tiltX, tiltY],
          pointer: [lightX, lightY],
          hover,
        },
      });
      try {
        frame(owner, (f) => f.pass(output, shader));
      } catch {
        fail();
      }
    });
    const move = (event: PointerEvent) => {
      if (paused || !event.isPrimary) return;
      const rect = canvas.getBoundingClientRect();
      const scale = Math.max(1, rect.height) / 1.4;
      pointerX =
        (event.clientX - rect.left - rect.width * Number(canvas.dataset.inkCenterX ?? 0.5)) /
        scale /
        0.64;
      pointerY =
        (event.clientY - rect.top - rect.height * Number(canvas.dataset.inkCenterY ?? 0.5)) /
        scale /
        0.91;
      const dx = Math.max(0, Math.abs(event.clientX - rect.left - rect.width / 2) - rect.width / 2);
      const dy = Math.max(
        0,
        Math.abs(event.clientY - rect.top - rect.height / 2) - rect.height / 2
      );
      const proximity = Math.max(0, 1 - Math.hypot(dx, dy) / Math.max(1, rect.height));
      targetHover = proximity * proximity * (3 - 2 * proximity);
    };
    const leave = () => {
      if (!paused) targetHover = 0;
    };
    const up = (event: PointerEvent) => {
      if (event.pointerType !== 'mouse') leave();
    };
    region.addEventListener('pointermove', move, { passive: true });
    region.addEventListener('pointerdown', move, { passive: true });
    region.addEventListener('pointerleave', leave);
    region.addEventListener('pointercancel', leave);
    region.addEventListener('pointerup', up);
    const resize = () => {
      if (disposed) return;
      const box = canvas.getBoundingClientRect();
      const dpr = Math.min(devicePixelRatio || 1, 1.5);
      output.resize([
        Math.max(1, Math.round(box.width * dpr)),
        Math.max(1, Math.round(box.height * dpr)),
      ]);
      ticker.redraw();
    };
    const unsubscribe = subscribe(resize);
    const onError = owner.onError(fail);
    void owner.gpu.lost.then(() => {
      if (!owner.disposed) fail();
    });
    remove = () => {
      ticker.dispose();
      unsubscribe();
      onError();
      region.removeEventListener('pointermove', move);
      region.removeEventListener('pointerdown', move);
      region.removeEventListener('pointerleave', leave);
      region.removeEventListener('pointercancel', leave);
      region.removeEventListener('pointerup', up);
    };
    resize();
    return {
      pause(value) {
        paused = value;
        ticker.pause(value);
      },
      pulse() {},
      dispose,
    };
  } catch (error) {
    dispose();
    throw error;
  }
}
