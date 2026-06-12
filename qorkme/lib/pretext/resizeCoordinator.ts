/**
 * Single global resize listener with RAF gate.
 * All PretextBlock instances share one window.resize subscription
 * to prevent multiple listeners and layout thrashing.
 */

type ResizeCallback = () => void;

const callbacks = new Set<ResizeCallback>();
let rafId: number | null = null;

function handleResize() {
  if (rafId !== null) return;
  rafId = requestAnimationFrame(() => {
    rafId = null;
    callbacks.forEach((cb) => cb());
  });
}

export function subscribe(cb: ResizeCallback): () => void {
  if (callbacks.size === 0) {
    window.addEventListener('resize', handleResize);
  }
  callbacks.add(cb);
  return () => {
    callbacks.delete(cb);
    if (callbacks.size === 0) {
      window.removeEventListener('resize', handleResize);
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    }
  };
}
