'use client';

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { prepareWithSegments, layoutNextLine, type LayoutCursor } from '@chenglou/pretext';
import { usePretextContext } from '@/lib/pretext';
import { useContainerWidth } from '@/lib/pretext/useContainerWidth';
import styles from './RoutedText.module.css';

type RoutedTextProps = {
  text: string;
  /** Unitless line-height matching the className's CSS line-height. */
  lineHeight: number;
  /** Obstacle box (top-right corner) the text flows around. */
  obstacleWidth?: number;
  obstacleHeight?: number;
  /** Rendered inside the obstacle box (e.g. the cube logo). */
  obstacle?: ReactNode;
  className?: string;
};

/**
 * Obstacle-aware text routing — Pretext's `layoutNextLine` with per-line
 * variable widths (the Dynamic Layout demo pattern): lines beside the
 * obstacle wrap short, lines below it run full width. Pure math, no DOM
 * reflow, no ResizeObserver (width via useContainerWidth/resizeCoordinator).
 *
 * Graceful degradation: until fonts are ready (or under 1024px, or with no
 * JS) the plain paragraph renders untouched — the obstacle only appears
 * when routing is active. Don't use with letter-spaced text (canvas
 * measurement ignores letter-spacing).
 */
export default function RoutedText({
  text,
  lineHeight,
  obstacleWidth = 132,
  obstacleHeight = 124,
  obstacle,
  className,
}: RoutedTextProps) {
  const { isReady } = usePretextContext();
  const [containerRef, width] = useContainerWidth();
  const elRef = useRef<HTMLDivElement | null>(null);
  const [lines, setLines] = useState<string[] | null>(null);

  const setRefs = useMemo(
    () => (node: HTMLDivElement | null) => {
      elRef.current = node;
      containerRef(node);
    },
    [containerRef]
  );

  useEffect(() => {
    // rAF-deferred: avoids a synchronous setState-in-effect cascade and lets
    // the measured width settle before routing
    const raf = requestAnimationFrame(() => {
      const el = elRef.current;
      if (!isReady || !el || width <= 0 || window.innerWidth < 1024) {
        setLines(null);
        return;
      }

      const cs = getComputedStyle(el);
      const font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
      const prepared = prepareWithSegments(text, font);
      const lineHeightPx = lineHeight * parseFloat(cs.fontSize);
      const besideRows = Math.ceil(obstacleHeight / lineHeightPx);
      const narrowWidth = Math.max(80, width - obstacleWidth - 28);

      const out: string[] = [];
      let cursor: LayoutCursor = { segmentIndex: 0, graphemeIndex: 0 };
      for (let i = 0; i < 400; i++) {
        const line = layoutNextLine(prepared, cursor, i < besideRows ? narrowWidth : width);
        if (line === null) break;
        out.push(line.text);
        cursor = line.end;
      }
      setLines(out.length > 1 ? out : null);
    });
    return () => cancelAnimationFrame(raf);
  }, [isReady, width, text, lineHeight, obstacleWidth, obstacleHeight]);

  return (
    <div ref={setRefs} className={className} style={{ position: 'relative' }}>
      {lines ? (
        <>
          <span
            className={styles.obstacle}
            style={{ width: obstacleWidth, height: obstacleHeight }}
            aria-hidden="true"
          >
            {obstacle}
          </span>
          {lines.map((line, i) => (
            <span key={i} className={styles.line}>
              {line}
            </span>
          ))}
        </>
      ) : (
        text
      )}
    </div>
  );
}
