/** A renderer owns one clock. Hidden tabs freeze time instead of accumulating it. */
export function createTicker(draw: (seconds: number, delta: number) => void, fps = 60) {
  let raf = 0;
  let disposed = false;
  let paused = false;
  let elapsed = 0;
  let previous = 0;
  let painted = 0;
  const stop = () => {
    cancelAnimationFrame(raf);
    raf = 0;
    previous = 0;
    painted = 0;
  };
  const tick = (now: number) => {
    raf = 0;
    if (disposed || paused || document.hidden) return;
    const delta = previous ? Math.min((now - previous) / 1000, 0.05) : 0;
    previous = now;
    elapsed += delta;
    if (!painted || now - painted >= 1000 / fps - 1) {
      draw(elapsed, delta);
      painted = now;
    }
    if (!disposed && !paused && !document.hidden) raf = requestAnimationFrame(tick);
  };
  const start = () => {
    if (!disposed && !paused && !document.hidden && !raf) raf = requestAnimationFrame(tick);
  };
  const visibility = () => {
    stop();
    start();
  };
  document.addEventListener('visibilitychange', visibility);
  return {
    start,
    redraw: () => {
      if (!disposed && !document.hidden) draw(elapsed, 0);
    },
    pause(value: boolean) {
      paused = value;
      stop();
      start();
    },
    dispose() {
      disposed = true;
      stop();
      document.removeEventListener('visibilitychange', visibility);
    },
  };
}

export type Disposable = { dispose(): void };

/** Late async initialization must never resurrect an unmounted look. */
export function ownAsync<T extends Disposable>(
  promise: Promise<T>,
  ready: (value: T) => void,
  failed: (error: unknown) => void
) {
  let disposed = false;
  let resource: T | undefined;
  void promise.then(
    (value) => {
      if (disposed) value.dispose();
      else {
        resource = value;
        ready(value);
      }
    },
    (error: unknown) => {
      if (!disposed) failed(error);
    }
  );
  return () => {
    disposed = true;
    resource?.dispose();
    resource = undefined;
  };
}

export type EffectController = Disposable & { pause(value: boolean): void; pulse(): void };
