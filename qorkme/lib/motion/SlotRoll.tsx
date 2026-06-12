'use client';

import { useCallback, useEffect, useMemo, useRef, useState, type ElementType } from 'react';
import {
  animateSlotText,
  attachSlotText,
  buildSlotText,
  clearSlotText,
  type SlotFlashOptions,
  type SlotTextController,
  type SlotTextOptions,
} from './slotText';

/**
 * React layer over the slotText engine (see slotText.ts for the rules).
 *
 * Both APIs follow the house contract: server HTML renders the plain final
 * text; the engine builds its cells client-side on mount. After mount the
 * engine OWNS the container's children — React must never reconcile them
 * again, which is why <SlotRoll> renders the useState-captured initial text
 * forever and routes every subsequent `text` change through an effect.
 *
 * (Named SlotRoll, not SlotText: the engine file slotText.ts would collide
 * case-insensitively with SlotText.tsx on Windows/macOS resolvers.)
 */

type SlotRollProps = {
  /** Current label. Changes roll; the change must be meaningful (a value). */
  text: string;
  /** Wrapper tag — default span (labels are inline). */
  as?: ElementType;
  className?: string;
  /** Engine options applied to every roll (held in a ref — safe to inline). */
  options?: SlotTextOptions;
};

/**
 * Declarative slot roll: re-render with a new `text` and the label rolls.
 *
 *   <SlotRoll text={status} options={{ direction: 'up' }} />
 */
export function SlotRoll({ text, as, className, options }: SlotRollProps) {
  const Tag = (as ?? 'span') as ElementType;
  const ref = useRef<HTMLElement | null>(null);
  const builtRef = useRef(false);
  // Captured once: the server/first-client render shows this plain text and
  // React never updates the children again (the engine replaces them).
  const [initialText] = useState(text);
  const optionsRef = useRef(options);
  const textRef = useRef(text);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    buildSlotText(el, textRef.current);
    builtRef.current = true;
    return () => {
      builtRef.current = false;
      clearSlotText(el);
    };
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el || !builtRef.current) return;
    animateSlotText(el, text, optionsRef.current);
  }, [text]);

  return (
    <Tag ref={ref} className={className}>
      {initialText}
    </Tag>
  );
}

type SlotRollHandle = {
  /** Permanent change (cancels a pending flash revert). */
  set: (text: string, options?: SlotTextOptions) => void;
  /** Transient change — auto-reverts to the resting text (~1.4s). */
  flash: (text: string, options?: SlotFlashOptions) => void;
};

/**
 * Imperative controller for call sites that drive a label from events
 * (CTA hover/click, the boot odometer). Returns a [refCallback, handle]
 * tuple (the useInViewOnce convention). `restingText` and `options` must be
 * stable — both are captured when the element attaches.
 *
 *   const [labelRef, label] = useSlotRoll('Get Started')
 *   <span ref={labelRef}>Get Started</span>
 *   onClick={() => label.flash('Opening form…')}
 */
export function useSlotRoll(
  restingText: string,
  options?: SlotTextOptions
): [(node: HTMLElement | null) => void, SlotRollHandle] {
  const controllerRef = useRef<SlotTextController | null>(null);
  const restingRef = useRef(restingText);
  const optionsRef = useRef(options);

  const refCallback = useCallback((node: HTMLElement | null) => {
    if (node) {
      // Same-text build: cells replace the plain text with no visual change.
      controllerRef.current = attachSlotText(node, restingRef.current, optionsRef.current);
    } else {
      controllerRef.current?.destroy();
      controllerRef.current = null;
    }
  }, []);

  const set = useCallback((text: string, opts?: SlotTextOptions) => {
    controllerRef.current?.set(text, opts);
  }, []);

  const flash = useCallback((text: string, opts?: SlotFlashOptions) => {
    controllerRef.current?.flash(text, opts);
  }, []);

  const handle = useMemo<SlotRollHandle>(() => ({ set, flash }), [set, flash]);
  return [refCallback, handle];
}
