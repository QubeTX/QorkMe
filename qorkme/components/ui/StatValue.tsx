'use client';

import { useEffect, useRef, type FC } from 'react';
import { animateSlotText, buildSlotText, clearSlotText } from '@/lib/motion/slotText';
import { decode } from '@/lib/motion/decode';
import { useInViewOnce } from '@/lib/motion/useInViewOnce';
import { useMotionPreference } from '@/lib/motion/useMotionPreference';
import styles from './StatValue.module.css';

type StatValueProps = {
  /** e.g. "07", "100%" — digits roll, prefix/suffix formatting preserved */
  value: string;
  label: string;
};

/** Pace per counting phase: the drain is brisk, the climb is the showpiece. */
const DOWN = { stepMs: 140, rate: 0.45 };
const UP = { stepMs: 190, rate: 0.3 };

/**
 * About-section stat. The Makira Black numeral counts UP from zero on first
 * view — exponential-approach steps (big jumps when far, single ticks near
 * the end) landing on the real value with the arrival-blue flash. Hovering
 * "re-verifies" it: a brisk count down to zero, then the same climb back,
 * while the label scramble-decodes (terminal flavor, repeatable).
 *
 * The displayed number always converges on a goal (0 or the value), so a
 * pointer leaving mid-count simply turns the count around from wherever it
 * is — no stuck or snapped states, whatever the user does.
 */
const StatValue: FC<StatValueProps> = ({ value, label }) => {
  const numRef = useRef<HTMLSpanElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);
  const ranRef = useRef(false);
  const currentRef = useRef(0);
  const goalRef = useRef(0);
  const timerRef = useRef<number | null>(null);
  const reduced = useMotionPreference();
  const [inViewRef, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.6 });

  const match = value.match(/^(\D*)(\d+)(\D*)$/);
  const target = match ? parseInt(match[2], 10) : 0;
  const fmt = (n: number) =>
    match ? `${match[1]}${String(n).padStart(match[2].length, '0')}${match[3]}` : value;

  /** One counting step toward the current goal; reschedules itself. */
  const tick = () => {
    const el = numRef.current;
    if (!el) {
      timerRef.current = null;
      return;
    }
    const goal = goalRef.current;
    const cur = currentRef.current;
    if (cur === goal) {
      if (goal === 0 && target > 0) {
        // Bottom of the hover dip — turn around and climb home.
        goalRef.current = target;
        timerRef.current = window.setTimeout(tick, UP.stepMs);
      } else {
        timerRef.current = null; // landed
      }
      return;
    }
    const up = goal > cur;
    const pace = up ? UP : DOWN;
    const next = cur + (up ? 1 : -1) * Math.max(1, Math.round(Math.abs(goal - cur) * pace.rate));
    currentRef.current = next;
    if (next === target && goal === target) {
      // The landing: default options — arrival blue settling into the gradient.
      animateSlotText(el, value, { direction: 'up' });
      timerRef.current = null;
      return;
    }
    animateSlotText(el, fmt(next), {
      direction: up ? 'up' : 'down', // the roll travels the way the number moves
      color: null, // quiet intermediates — the blue is saved for the landing
      duration: 150,
      stagger: 30,
    });
    timerRef.current = window.setTimeout(tick, pace.stepMs);
  };

  /** Point the count at a new goal; start the loop if it isn't running. */
  const seek = (goal: number) => {
    goalRef.current = goal;
    if (timerRef.current === null) {
      timerRef.current = window.setTimeout(
        tick,
        goal < currentRef.current ? DOWN.stepMs : UP.stepMs
      );
    }
  };

  useEffect(() => {
    if (!inView || ranRef.current) return;
    ranRef.current = true;
    if (reduced || !match || target === 0) return;
    const el = numRef.current;
    if (!el) return;
    currentRef.current = 0;
    buildSlotText(el, fmt(0));
    seek(target);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView, reduced]);

  // Unmount: stop the loop, settle the engine, restore plain text.
  useEffect(() => {
    const el = numRef.current;
    return () => {
      if (timerRef.current !== null) window.clearTimeout(timerRef.current);
      if (el) clearSlotText(el, value);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onEnter = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse' || reduced || !ranRef.current || !match || target === 0) return;
    seek(0);
    if (labelRef.current) decode(labelRef.current, 320);
  };

  const onLeave = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    // Mid-count departure: converge on the real value from wherever we are.
    if (timerRef.current !== null) goalRef.current = target;
  };

  return (
    <div ref={inViewRef} className={styles.stat} onPointerEnter={onEnter} onPointerLeave={onLeave}>
      <span ref={numRef} className={styles.value}>
        {value}
      </span>
      <span ref={labelRef} className={styles.label}>
        {label}
      </span>
    </div>
  );
};

export default StatValue;
