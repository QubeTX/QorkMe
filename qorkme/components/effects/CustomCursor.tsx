'use client';

import { useEffect, useRef, type FC } from 'react';
import { CursorEngine, type CursorMode } from './cursorEngine';
import styles from './CustomCursor.module.css';

const INTERACTIVE_SELECTOR = 'a, button, [role="button"], [data-interactive="true"]';
const TEXT_SELECTOR = 'p, h1, h2, h3, h4, h5, h6, li, [data-cursor="text"]';

/**
 * Thin React mount for the cursor. The three layers render unconditionally
 * (CSS hides them on touch / reduced motion); CursorEngine owns all physics
 * and writes. No React state — media-query flips rebind via plain listeners.
 */
const CustomCursor: FC = () => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const bloomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    const bloom = bloomRef.current;
    if (!dot || !ring || !bloom || typeof window.matchMedia !== 'function') return;

    const fineQuery = window.matchMedia('(pointer: fine)');
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    let engine: CursorEngine | null = null;

    const resolveMode = (target: EventTarget | null): { mode: CursorMode; el: Element | null } => {
      if (!(target instanceof Element)) return { mode: 'default', el: null };
      const magnetic = target.closest('[data-magnetic]');
      if (magnetic) return { mode: 'magnetic', el: magnetic };
      const interactive = target.closest(INTERACTIVE_SELECTOR);
      if (interactive) return { mode: 'interactive', el: interactive };
      if (target.closest(TEXT_SELECTOR)) return { mode: 'text', el: null };
      return { mode: 'default', el: null };
    };

    const onMove = (e: PointerEvent) => engine?.move(e.clientX, e.clientY);
    const onOver = (e: PointerEvent) => {
      const { mode, el } = resolveMode(e.target);
      engine?.setMode(mode, el);
    };
    const onDown = () => engine?.press(true);
    const onUp = () => engine?.press(false);
    const onLeave = () => engine?.hide();

    const setup = () => {
      if (engine || !fineQuery.matches || motionQuery.matches) return;
      engine = new CursorEngine(dot, ring, bloom);
      window.addEventListener('pointermove', onMove, { passive: true });
      document.addEventListener('pointerover', onOver, { passive: true });
      document.addEventListener('pointerdown', onDown, { passive: true });
      document.addEventListener('pointerup', onUp, { passive: true });
      document.addEventListener('mouseleave', onLeave);
      window.addEventListener('blur', onLeave);
    };

    const teardown = () => {
      if (!engine) return;
      window.removeEventListener('pointermove', onMove);
      document.removeEventListener('pointerover', onOver);
      document.removeEventListener('pointerdown', onDown);
      document.removeEventListener('pointerup', onUp);
      document.removeEventListener('mouseleave', onLeave);
      window.removeEventListener('blur', onLeave);
      engine.destroy();
      engine = null;
    };

    const reevaluate = () => {
      teardown();
      setup();
    };

    setup();
    fineQuery.addEventListener('change', reevaluate);
    motionQuery.addEventListener('change', reevaluate);

    return () => {
      fineQuery.removeEventListener('change', reevaluate);
      motionQuery.removeEventListener('change', reevaluate);
      teardown();
    };
  }, []);

  return (
    <>
      <div ref={bloomRef} className={styles.cursorBloom} aria-hidden="true" />
      <div ref={ringRef} className={styles.cursorRing} aria-hidden="true" />
      <div ref={dotRef} className={styles.cursorDot} aria-hidden="true" />
    </>
  );
};

export default CustomCursor;
