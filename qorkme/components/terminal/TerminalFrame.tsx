'use client';

import { useEffect, useRef, type FC } from 'react';
import clsx from 'clsx';
import { useInViewOnce } from '@/lib/motion/useInViewOnce';
import { useMotionPreference } from '@/lib/motion/useMotionPreference';
import styles from './TerminalFrame.module.css';

export type TerminalLine = {
  text: string;
  /** Render in the arrival accent (success/landmark lines). */
  accent?: boolean;
  /** Prefix with the $ prompt glyph. */
  prompt?: boolean;
};

type TerminalFrameProps = {
  /** Header-bar left label, e.g. "TR-300 // SAMPLE OUTPUT". */
  title: string;
  /** Header-bar right metadata, e.g. "NODE_ID: QBTX-01". */
  meta?: string;
  lines: TerminalLine[];
  /**
   * Boot-print: stream the lines in on first scroll-into-view, the way the
   * QubeTX boot screen renders (default true). Server HTML always carries
   * the full final text — the print is a client-side reveal, never a
   * content source. Reduced motion shows everything immediately.
   */
  bootPrint?: boolean;
  /** Stamp [hh:mm:ss] at REVEAL time (terminal honesty — real clock). */
  timestamps?: boolean;
  className?: string;
};

const PRINT_BASE_MS = 90;
const PRINT_JITTER_MS = 70;
/**
 * QorkMe divergence: when an output line (`accent`) is followed by an input
 * line (`prompt`) — the output→next-command boundary in a sample session — the
 * frame holds for a beat before the next command types in, the way a real
 * terminal pauses after printing a result. Other transitions keep the fast
 * boot-print cadence; reduced motion is unaffected (everything reveals at once).
 */
const OUTPUT_HOLD_MS = 1400;

function timestamp(): string {
  return `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}]`;
}

/**
 * The technical register's core surface: terminal chrome around a line
 * stream. Generalized from the reports.qubetx.com sample-output blocks and
 * retooled onto the boot screen's render language — lines print in with a
 * staggered cadence and live timestamps when the frame first scrolls into
 * view. The component owns its lines' inline visibility (one owner per
 * property — nothing else animates them).
 */
const TerminalFrame: FC<TerminalFrameProps> = ({
  title,
  meta,
  lines,
  bootPrint = true,
  timestamps = false,
  className,
}) => {
  const bodyRef = useRef<HTMLDivElement | null>(null);
  const printedRef = useRef(false);
  const timersRef = useRef<number[]>([]);
  const reduced = useMotionPreference();
  const [inViewRef, inView] = useInViewOnce<HTMLDivElement>({ threshold: 0.3 });

  const setRefs = (node: HTMLDivElement | null) => {
    bodyRef.current = node;
    inViewRef(node);
  };

  // Hide lines client-side before the first print (server HTML stays
  // visible — no-JS and crawlers always see the full output).
  useEffect(() => {
    if (!bootPrint || reduced || printedRef.current || inView) return;
    const rows = bodyRef.current?.querySelectorAll<HTMLElement>('[data-term-line]');
    rows?.forEach((row) => {
      row.style.visibility = 'hidden';
    });
  }, [bootPrint, reduced, inView]);

  useEffect(() => {
    if (!bootPrint || !inView || printedRef.current) return;
    printedRef.current = true;
    const body = bodyRef.current;
    if (!body) return;
    const rows = [...body.querySelectorAll<HTMLElement>('[data-term-line]')];

    if (reduced) {
      rows.forEach((row) => row.style.removeProperty('visibility'));
      return;
    }

    const timers = timersRef.current;
    body.setAttribute('data-printing', '');
    let at = 0;
    rows.forEach((row, i) => {
      // Hold on a printed result before the next command types in.
      const afterOutput = i > 0 && lines[i - 1]?.accent && lines[i]?.prompt;
      at +=
        i === 0
          ? 60
          : afterOutput
            ? OUTPUT_HOLD_MS
            : PRINT_BASE_MS + Math.random() * PRINT_JITTER_MS;
      timers.push(
        window.setTimeout(() => {
          row.style.removeProperty('visibility');
          if (timestamps) {
            const ts = row.querySelector<HTMLElement>('[data-term-ts]');
            if (ts) ts.textContent = timestamp();
          }
          row.setAttribute('data-term-printed', '');
          if (i === rows.length - 1) body.removeAttribute('data-printing');
        }, at)
      );
    });
  }, [bootPrint, inView, reduced, timestamps, lines]);

  useEffect(() => {
    const timers = timersRef.current;
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, []);

  return (
    <figure className={clsx(styles.frame, className)}>
      <figcaption className={styles.header}>
        <span>{title}</span>
        {meta && <span className={styles.meta}>{meta}</span>}
      </figcaption>
      <div ref={setRefs} className={styles.body} data-term-body>
        {lines.map((line, i) => (
          <div key={i} data-term-line className={clsx(styles.line, line.accent && styles.accent)}>
            {timestamps && (
              <span className={styles.timestamp} data-term-ts>
                [··:··:··]
              </span>
            )}
            {line.prompt && (
              <span className={styles.prompt} aria-hidden="true">
                ${' '}
              </span>
            )}
            {line.text}
          </div>
        ))}
        <span className={styles.cursor} aria-hidden="true" />
      </div>
    </figure>
  );
};

export default TerminalFrame;
