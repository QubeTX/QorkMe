'use client';

import { useEffect, useRef, useState } from 'react';
import clsx from 'clsx';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { attachSlotText, type SlotTextController } from '@/lib/motion/slotText';
import styles from './BootScreen.module.css';

/**
 * First-load boot screen (SYSTEM_INITIALIZER) — covers initial hydration/
 * font-load jank behind an on-brand terminal boot sequence. Ported from
 * Emmett's Variant sample onto the v3 tokens.
 *
 * Lifecycle contract:
 * - The inline script in app/layout.tsx sets `html[data-boot]` BEFORE first
 *   paint — only when sessionStorage lacks the booted flag and the user
 *   doesn't prefer reduced motion. Without the attribute, CSS hides this
 *   overlay entirely (return visits / reduced motion / no-JS never see it).
 * - The overlay is server-rendered so it paints before hydration; the
 *   blinking cursor, pulsing dot, and first log line are pure CSS and run
 *   pre-JS. After hydration, the log stream + progress are driven here.
 * - Completion is fully dynamic: max(MIN_BOOT_MS, fonts loaded, window
 *   `load`, and a double-rAF painted-frame confirmation) — the minimum
 *   clock also only starts once hydration reaches this effect, so slow
 *   networks/devices extend the boot automatically (progress parks at 99%
 *   and an AWAITING RENDERER SYNC line appears while waiting). On
 *   completion: sessionStorage flag is set, `data-boot` is lifted, and the
 *   `qubetx:boot-complete` event fires — LoadSequence waits for it, so the
 *   hero entrance plays while the overlay fades (seamless handoff).
 * - Failsafe: the inline script force-lifts `data-boot` after 10s so a
 *   hydration failure can never trap the visitor behind the overlay.
 */

export const BOOT_DONE_EVENT = 'qubetx:boot-complete';
export const BOOT_FLAG = 'qubetx:booted';

const MIN_BOOT_MS = 5000;
const EXIT_MS = 700;

const LOGS: { text: string; accent?: boolean }[] = [
  { text: 'MOUNTING /ASSETS/FONTS/ :: MAKIRA, PLEX_MONO' },
  { text: 'ESTABLISHING CANVAS CONTEXT...' },
  { text: 'ANIME.JS CORE LOADED SUCCESS.', accent: true },
  { text: 'CALIBRATING DOT_MATRIX: 1400 NODES' },
  { text: 'SYNCING SCROLL_DRIVER: LENIS' },
  { text: 'VERIFYING SECURITY_PATCHES...' },
  { text: 'READYING USER_INTERFACE_LAYER...' },
  { text: 'BOOTSTRAPPING COMPLETE.', accent: true },
];

function timestamp(): string {
  return `[${new Date().toLocaleTimeString('en-GB', { hour12: false })}]`;
}

/** Resolves once every critical subresource has loaded (immediate if past). */
function windowLoaded(): Promise<void> {
  if (document.readyState === 'complete') return Promise.resolve();
  return new Promise((resolve) => window.addEventListener('load', () => resolve(), { once: true }));
}

/** Resolves after the renderer has actually produced a frame (double rAF). */
function framePainted(): Promise<void> {
  if (typeof requestAnimationFrame === 'undefined') return Promise.resolve();
  return new Promise((resolve) =>
    requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
  );
}

export default function BootScreen() {
  const streamRef = useRef<HTMLDivElement | null>(null);
  const barRef = useRef<HTMLDivElement | null>(null);
  const pctRef = useRef<HTMLSpanElement | null>(null);
  const [exiting, setExiting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const html = document.documentElement;

    const complete = () => {
      try {
        sessionStorage.setItem(BOOT_FLAG, '1');
      } catch {
        /* storage unavailable — boot will just replay next load */
      }
      html.removeAttribute('data-boot');
      window.dispatchEvent(new Event(BOOT_DONE_EVENT));
    };

    // Skip path: the inline script didn't arm the boot (return visit,
    // reduced motion, storage off + failsafe, or no-JS prerender heuristics)
    if (!html.hasAttribute('data-boot') || prefersReducedMotion()) {
      complete();
      const raf = requestAnimationFrame(() => setDone(true));
      return () => cancelAnimationFrame(raf);
    }

    let cancelled = false;
    const timeouts: ReturnType<typeof setTimeout>[] = [];
    const start = performance.now();

    // Percent readout rolls per digit (slot roll, odometer-tuned): quiet
    // ink-only — the 90ms tick outruns any color fade — counting up, so
    // glyphs enter from below. Armed path only; the server-rendered 0%
    // keeps the pre-hydration overlay intact.
    let pctSlot: SlotTextController | null = null;
    if (pctRef.current) {
      pctSlot = attachSlotText(pctRef.current, '0%', {
        direction: 'up',
        duration: 120,
        stagger: 0,
        bounce: 0,
        color: null,
      });
    }

    // Log stream — cadence tuned so all lines land within MIN_BOOT_MS
    const addLog = (index: number) => {
      if (cancelled || index >= LOGS.length) return;
      const stream = streamRef.current;
      if (stream) {
        const entry = document.createElement('div');
        entry.className = clsx(styles.entry, LOGS[index].accent && styles.accent);
        const ts = document.createElement('span');
        ts.className = styles.timestamp;
        ts.textContent = timestamp();
        entry.append(ts, ` ${LOGS[index].text}`);
        stream.appendChild(entry);
        stream.scrollTop = stream.scrollHeight;
      }
      timeouts.push(setTimeout(() => addLog(index + 1), 320 + Math.random() * 280));
    };
    timeouts.push(setTimeout(() => addLog(0), 400));

    // Progress — tracks elapsed time, parks at 99% until actually ready
    const progressInterval = setInterval(() => {
      if (cancelled) return;
      const elapsed = performance.now() - start;
      const pct = Math.min(99, Math.floor((elapsed / MIN_BOOT_MS) * 96 + Math.random() * 3));
      if (barRef.current) barRef.current.style.width = `${pct}%`;
      pctSlot?.set(`${pct}%`);
    }, 90);

    const minTime = new Promise((resolve) => timeouts.push(setTimeout(resolve, MIN_BOOT_MS)));
    const fontsReady = document.fonts?.ready ?? Promise.resolve();

    // If the renderer outlasts the minimum, say so (terminal honesty)
    let completed = false;
    timeouts.push(
      setTimeout(() => {
        if (cancelled || completed) return;
        const stream = streamRef.current;
        if (!stream) return;
        const entry = document.createElement('div');
        entry.className = styles.entry;
        const ts = document.createElement('span');
        ts.className = styles.timestamp;
        ts.textContent = timestamp();
        entry.append(ts, ' AWAITING RENDERER SYNC...');
        stream.appendChild(entry);
        stream.scrollTop = stream.scrollHeight;
      }, MIN_BOOT_MS + 700)
    );

    // Dynamic completion: minimum hold + fonts + every critical subresource,
    // then confirmation that the renderer has actually painted a frame
    Promise.all([minTime, fontsReady, windowLoaded()])
      .then(() => framePainted())
      .then(() => {
        if (cancelled) return;
        completed = true;
        clearInterval(progressInterval);
        if (barRef.current) barRef.current.style.width = '100%';
        pctSlot?.set('100%');
        timeouts.push(
          setTimeout(() => {
            if (cancelled) return;
            // Hand off: entrance plays behind the overlay as it fades
            complete();
            setExiting(true);
            timeouts.push(setTimeout(() => setDone(true), EXIT_MS));
          }, 280)
        );
      });

    return () => {
      cancelled = true;
      clearInterval(progressInterval);
      timeouts.forEach(clearTimeout);
      pctSlot?.destroy(); // clears every roll timer (cancel contract)
    };
  }, []);

  return (
    <div
      className={clsx(styles.overlay, exiting && styles.exiting, done && styles.done)}
      role="status"
      aria-label="Loading QubeTX"
      aria-hidden={done || undefined}
    >
      <div className={styles.grid} aria-hidden="true" />
      <div className={styles.frame}>
        <span className={clsx(styles.decor, styles.decorTop)} aria-hidden="true" />
        <span className={clsx(styles.decor, styles.decorLeft)} aria-hidden="true" />

        <div className={styles.box}>
          <div className={styles.header}>
            <span>SYSTEM_INITIALIZER // V.3.1.0</span>
            <span>NODE_ID: QBTX-01</span>
          </div>

          <div ref={streamRef} className={styles.stream}>
            {/* Server-rendered first line — alive before hydration */}
            <div className={styles.entry}>
              <span className={styles.timestamp}>[··:··:··]</span> INITIALIZING SYSTEM KERNEL...
            </div>
          </div>

          <div className={styles.progressSection}>
            <div className={styles.progressLabel}>
              <span>Asset extraction</span>
              <span ref={pctRef}>0%</span>
            </div>
            <div className={styles.barTrack}>
              <div ref={barRef} className={styles.barFill} />
            </div>
          </div>
        </div>

        <div className={styles.badge} aria-hidden="true">
          <span className={styles.dot} />
          <span>
            UPLOADING CORE_SERVICE_DOMAIN
            <span className={styles.cursor} />
          </span>
        </div>
      </div>
    </div>
  );
}
