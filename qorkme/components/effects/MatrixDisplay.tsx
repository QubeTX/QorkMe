'use client';

import { useEffect, useRef, type FC } from 'react';
import { animate, createTimer, utils } from '@/lib/motion/anime';
import { buildColorRamp, rampIndex } from '@/lib/motion/colorRamp';
import { renderWord } from '@/lib/motion/dotFont';
import { prefersReducedMotion } from '@/lib/motion/useMotionPreference';
import { EASE_ANIME } from '@/lib/motion/tokens';
import { subscribe as subscribeResize } from '@/lib/pretext/resizeCoordinator';

/**
 * LED dot-matrix display (the Services-grid filler cell): a coarse dot board
 * where anime.js sweeps words in and out, left → right, on an endless loop.
 * Same architecture as DotGrid — anime owns every animated value (each dot's
 * `lit` channel); Canvas 2D only blits.
 *
 * Lifecycle mirrors DotGrid: IO-paused offscreen, resizeCoordinator rebuilds,
 * reduced motion renders the first word statically. ~≤1300 dots.
 */

type MatrixDot = { x: number; y: number; col: number; lit: number };

const LUT = buildColorRamp('#0066FF', '#7c3aed', 256);
const DPR_CAP = 1.5;
const HOLD_MS = 2300;
const SWEEP_MS = 650;
const COL_STAGGER_MS = 14;
/** Blank board columns beyond the longest word. */
const COL_PADDING = 6;

type MatrixDisplayProps = {
  words: string[];
  className?: string;
};

const MatrixDisplay: FC<MatrixDisplayProps> = ({ words, className }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wordsKey = words.join('|');

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas || wordsKey.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return; // jsdom / very old browsers

    const wordList = wordsKey.split('|');
    const reduced = prefersReducedMotion();
    let dots: MatrixDot[] = [];
    let cols = 0;
    let rows = 0;
    let width = 0;
    let height = 0;
    let raf: number | null = null;
    let visible = true;
    let disposed = false;
    let wordIndex = 0;
    let holdTimer: ReturnType<typeof createTimer> | null = null;

    let dotR = 2; // derived from pitch in build()

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

    const maxWordCols = Math.max(...wordList.map((word) => renderWord(word).cols));

    /** Per-dot target values for a word, centered on the board. */
    const targetsFor = (word: string): number[] => {
      const bitmap = renderWord(word);
      // Uniform scale across all words (based on the longest) so the
      // display size never jumps between words
      const scale = Math.max(
        1,
        Math.min(Math.floor((rows * 0.78) / bitmap.rows), Math.floor((cols - 2) / maxWordCols))
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

    const showWord = (index: number) => {
      if (disposed) return;
      const targets = targetsFor(wordList[index % wordList.length]);
      utils.remove(dots, undefined, 'lit');
      animate(dots, {
        lit: (_: unknown, i: number) => targets[i],
        duration: SWEEP_MS,
        ease: EASE_ANIME,
        delay: (_: unknown, i: number) => dots[i].col * COL_STAGGER_MS,
      });
      holdTimer = createTimer({
        duration: SWEEP_MS + cols * COL_STAGGER_MS + HOLD_MS,
        onComplete: () => {
          wordIndex = (index + 1) % wordList.length;
          showWord(wordIndex);
        },
      });
    };

    const build = () => {
      utils.remove(dots, undefined, 'lit');
      holdTimer?.cancel?.();
      const rect = container.getBoundingClientRect();
      width = rect.width;
      height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, DPR_CAP);
      canvas.width = Math.max(1, Math.round(width * dpr));
      canvas.height = Math.max(1, Math.round(height * dpr));
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Board width tracks the longest word: chunky LEDs in wide cells,
      // finer dots in narrow ones — the word always spans ~the full board
      cols = maxWordCols + COL_PADDING;
      const pitch = width / cols;
      rows = Math.max(9, Math.floor(height / pitch));
      dotR = Math.max(1.4, pitch * 0.3);
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

      if (reduced) {
        // Static first word, no loop
        const targets = targetsFor(wordList[0]);
        dots.forEach((dot, i) => {
          dot.lit = targets[i];
        });
        draw();
        return;
      }
      showWord(wordIndex);
    };

    const io =
      typeof IntersectionObserver !== 'undefined'
        ? new IntersectionObserver((entries) => {
            visible = entries.some((entry) => entry.isIntersecting);
            if (visible) {
              holdTimer?.play?.();
              startLoop();
            } else {
              holdTimer?.pause?.();
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
      stopLoop();
      io?.disconnect();
      unsubscribeResize();
      holdTimer?.cancel?.();
      utils.remove(dots);
    };
  }, [wordsKey]);

  return (
    <div ref={containerRef} className={className} aria-hidden="true">
      <canvas ref={canvasRef} style={{ display: 'block', pointerEvents: 'none' }} />
    </div>
  );
};

export default MatrixDisplay;
