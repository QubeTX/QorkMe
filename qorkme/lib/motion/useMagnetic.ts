'use client';

import { useEffect, useRef } from 'react';
import { prefersReducedMotion } from './useMotionPreference';

/**
 * Magnetic pull: translates the element toward the pointer while hovered,
 * springing back on leave (cash.app physicality).
 *
 * OWNERSHIP: this hook owns the element's inline transform. Never attach it
 * to a node that Framer Motion or anime.js also transforms — wrap instead.
 * Pairs with the cursor's [data-magnetic] ring-docking mode.
 *
 * Engineering notes: rect cached on pointerenter (no per-frame reads),
 * delta-time-normalized lerp (identical feel at 60/120/144Hz), rAF runs
 * only while engaged and cancels once settled.
 */
export function useMagnetic<T extends HTMLElement>(strength = 6) {
  const ref = useRef<T | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof window === 'undefined') return;
    if (prefersReducedMotion()) return;
    if (typeof window.matchMedia === 'function' && !window.matchMedia('(pointer: fine)').matches) {
      return;
    }

    let rect: DOMRect | null = null;
    let raf: number | null = null;
    let hovering = false;
    let last = 0;
    const target = { x: 0, y: 0 };
    const current = { x: 0, y: 0 };

    const tick = (now: number) => {
      raf = null;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      const k = 1 - Math.pow(1 - 0.18, dt * 60);
      current.x += (target.x - current.x) * k;
      current.y += (target.y - current.y) * k;

      if (!hovering && Math.abs(current.x) < 0.05 && Math.abs(current.y) < 0.05) {
        el.style.transform = '';
        return;
      }
      el.style.transform = `translate3d(${current.x.toFixed(2)}px, ${current.y.toFixed(2)}px, 0)`;
      raf = requestAnimationFrame(tick);
    };

    const start = () => {
      if (raf == null) {
        last = performance.now();
        raf = requestAnimationFrame(tick);
      }
    };

    const clamp = (v: number) => Math.max(-strength, Math.min(strength, v));

    const onEnter = () => {
      rect = el.getBoundingClientRect();
      hovering = true;
      start();
    };
    const onMove = (e: PointerEvent) => {
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      target.x = clamp(((e.clientX - cx) / (rect.width / 2)) * strength);
      target.y = clamp(((e.clientY - cy) / (rect.height / 2)) * strength);
    };
    const onLeave = () => {
      hovering = false;
      rect = null;
      target.x = 0;
      target.y = 0;
      start();
    };

    el.addEventListener('pointerenter', onEnter, { passive: true });
    el.addEventListener('pointermove', onMove, { passive: true });
    el.addEventListener('pointerleave', onLeave, { passive: true });

    return () => {
      el.removeEventListener('pointerenter', onEnter);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      if (raf != null) cancelAnimationFrame(raf);
      el.style.transform = '';
    };
  }, [strength]);

  return ref;
}
