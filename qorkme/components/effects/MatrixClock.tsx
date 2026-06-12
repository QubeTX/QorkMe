'use client';

import { useEffect, useRef, type FC } from 'react';
import { animate, utils } from '@/lib/motion/anime';
import { buildColorRamp, rampIndex } from '@/lib/motion/colorRamp';
import { renderWord } from '@/lib/motion/dotFont';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { EASE_ANIME } from '@/lib/motion/tokens';
import { subscribe as subscribeResize } from '@/lib/pretext/resizeCoordinator';

/**
 * QorkMe's live LED dot-matrix clock — same architecture as the kit's
 * MatrixDisplay (anime.js owns each dot's `lit` channel, Canvas 2D only
 * blits; IO-paused offscreen; resizeCoordinator rebuilds) but driven by the
 * real wall clock instead of a word cycle. Only the dots whose state changes
 * animate on each tick (the slot-roll skipUnchanged principle).
 *
 * The terminal is honest: this renders the visitor's actual local time,
 * 12-hour with AM/PM. Client-only by design (a canvas has no hydration
 * surface; the server renders an empty board).
 */

type MatrixDot = { x: number; y: number; col: number; lit: number };

// Sage -> bamboo, matching --gradient-brand and the MatrixDisplay ramp
const LUT = buildColorRamp('#4a9e5c', '#c4a876', 256);
const DPR_CAP = 1.5;
const TICK_SWEEP_MS = 220;

type MatrixClockProps = {
  /** Include seconds (HH:MM:SS AM). Without: HH:MM AM. */
  seconds?: boolean;
  className?: string;
};

function formatTime(date: Date, withSeconds: boolean): string {
  let h = date.getHours();
  const period = h >= 12 ? 'PM' : 'AM';
  h = h % 12 || 12;
  const hh = String(h).padStart(2, '0');
  const mm = String(date.getMinutes()).padStart(2, '0');
  const ss = String(date.getSeconds()).padStart(2, '0');
  return withSeconds ? `${hh}:${mm}:${ss} ${period}` : `${hh}:${mm} ${period}`;
}

const MatrixClock: FC<MatrixClockProps> = ({ seconds = false, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // jsdom / very old browsers

    const reduced = prefersReducedMotion();
    let dots: MatrixDot[] = [];
    let currentTargets: number[] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let raf: number | null = null;
    let visible = true;
    let disposed = false;
    let dotR = 2;

    // Padded HH keeps the string length constant, so board geometry never
    // changes between ticks
    const boardCols = renderWord(formatTime(new Date(), seconds)).cols + 4;

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      for (const dot of dots) {
        const alpha = 0.05 + dot.lit * 0.8;
        ctx.globalAlpha = Math.min(1, alpha);
        ctx.fillStyle = LUT[rampIndex(dot.x / Math.max(1, width))];
        ctx.beginPath();
        ctx.arc(dot.x, dot.y, dotR * (0.55 + dot.lit * 0.45), 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
    };

    const loop = () => {
      raf = null;
      if (!visible || disposed) return;
      draw();
      raf = requestAnimationFrame(loop);
    };
    const startLoop = () => {
      if (raf == null && visible && !disposed) raf = requestAnimationFrame(loop);
    };
    const stopLoop = () => {
      if (raf != null) {
        cancelAnimationFrame(raf);
        raf = null;
      }
    };

    const targetsFor = (text: string): number[] => {
      const bitmap = renderWord(text);
      const scale = Math.max(
        1,
        Math.min(Math.floor((rows * 0.85) / bitmap.rows), Math.floor((cols - 2) / bitmap.cols))
      );
      const offsetCol = Math.floor((cols - bitmap.cols * scale) / 2);
      const offsetRow = Math.floor((rows - bitmap.rows * scale) / 2);
      const rowPitch = height / rows;
      return dots.map((dot) => {
        const c = Math.floor((dot.col - offsetCol) / scale);
        const r = Math.floor((Math.round(dot.y / rowPitch - 0.5) - offsetRow) / scale);
        return bitmap.get(c, r) ? 1 : 0;
      });
    };

    const applyTime = (instant: boolean) => {
      if (disposed || dots.length === 0) return;
      const targets = targetsFor(formatTime(new Date(), seconds));

      if (instant || reduced) {
        dots.forEach((dot, i) => {
          dot.lit = targets[i];
        });
        currentTargets = targets;
        if (reduced) draw();
        return;
      }

      // Animate only the dots that change (skipUnchanged principle)
      const changedDots: MatrixDot[] = [];
      const changedTargets: number[] = [];
      dots.forEach((dot, i) => {
        if (currentTargets[i] !== targets[i]) {
          changedDots.push(dot);
          changedTargets.push(targets[i]);
        }
      });
      currentTargets = targets;
      if (changedDots.length === 0) return;

      utils.remove(changedDots, undefined, 'lit');
      animate(changedDots, {
        lit: (_: unknown, i: number) => changedTargets[i],
        duration: TICK_SWEEP_MS,
        ease: EASE_ANIME,
      });
    };

    const build = () => {
      utils.remove(dots, undefined, 'lit');
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = boardCols;
      const pitch = width / cols;
      rows = Math.max(7, Math.floor(height / pitch));
      dotR = Math.max(1.2, pitch * 0.3);
      dots = [];
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          dots.push({
            x: (c + 0.5) * pitch,
            y: (r + 0.5) * (height / rows),
            col: c,
            lit: 0,
          });
        }
      }
      currentTargets = dots.map(() => 0);
      applyTime(true);
      if (reduced) draw();
    };

    const interval = setInterval(() => {
      if (!visible || disposed) return;
      applyTime(false);
    }, 1000);

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            if (visible) {
              applyTime(true); // catch up after being offscreen
              startLoop();
            } else {
              stopLoop();
            }
          })
        : null;
    io?.observe(container);

    build();
    if (!reduced) startLoop();
    const unsubscribeResize = subscribeResize(build);

    return () => {
      disposed = true;
      clearInterval(interval);
      stopLoop();
      io?.disconnect();
      unsubscribeResize();
      utils.remove(dots);
    };
  }, [seconds]);

  return (
    <div ref={containerRef} className={className} role="timer" aria-label="Current local time">
      <canvas ref={canvasRef} style={{ display: 'block', pointerEvents: 'none' }} />
    </div>
  );
};

export default MatrixClock;
