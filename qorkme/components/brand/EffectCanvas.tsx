'use client';

import { useEffect, useRef, useState, type RefObject } from 'react';
import { subscribe } from '@/lib/pretext/resizeCoordinator';
import { ownAsync, type EffectController } from './effects/lifecycle';
import styles from './BrandStage.module.css';

/** The HTML wordmark stays visible if fonts, Canvas or WebGPU fail. */
function applyMask(canvas: HTMLCanvasElement, wordmark: HTMLElement, text: string) {
  const style = getComputedStyle(wordmark);
  const rect = wordmark.getBoundingClientRect();
  const mask = document.createElement('canvas');
  const dpr = Math.min(devicePixelRatio || 1, 2);
  mask.width = Math.max(1, Math.round(rect.width * dpr));
  mask.height = Math.max(1, Math.round(rect.height * dpr));
  const ctx = mask.getContext('2d');
  if (!ctx) throw new Error('Wordmark mask unavailable');
  ctx.scale(dpr, dpr);
  ctx.font = `${style.fontWeight} ${style.fontSize} ${style.fontFamily}`;
  ctx.letterSpacing = style.letterSpacing;
  const metrics = ctx.measureText(text);
  const ascent = metrics.fontBoundingBoxAscent;
  const descent = metrics.fontBoundingBoxDescent;
  ctx.fillStyle = '#fff';
  const baseline = (rect.height - ascent - descent) / 2 + ascent;
  ctx.fillText(text, 0, baseline);
  // Align the engraving to visible ink, excluding advance width and font leading.
  canvas.dataset.inkCenterX = String(
    (metrics.actualBoundingBoxRight - metrics.actualBoundingBoxLeft) / 2 / Math.max(1, rect.width)
  );
  canvas.dataset.inkCenterY = String(
    (baseline + (metrics.actualBoundingBoxDescent - metrics.actualBoundingBoxAscent) / 2) /
      Math.max(1, rect.height)
  );
  canvas.style.maskImage = `url(${mask.toDataURL()})`;
  canvas.style.maskSize = '100% 100%';
}

type Props = {
  kind: 'dither' | 'hologram';
  region: RefObject<HTMLDivElement | null>;
  mask?: RefObject<HTMLSpanElement | null>;
  paused: boolean;
  pulse: number;
  text?: string;
  layout?: 'brand' | 'page';
};

export function EffectCanvas({
  kind,
  region,
  mask,
  paused,
  pulse,
  text = 'QORK.ME',
  layout = 'brand',
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const renderer = useRef<EffectController | null>(null);
  const preference = useRef(paused);
  const [state, setState] = useState('loading');
  useEffect(() => {
    preference.current = paused;
    renderer.current?.pause(paused);
  }, [paused]);
  useEffect(() => {
    if (pulse) renderer.current?.pulse();
  }, [pulse]);
  useEffect(() => {
    const canvas = canvasRef.current;
    const host = region.current;
    if (!canvas || !host) return;
    let alive = true;
    let hasFailed = false;
    const failed = () => {
      hasFailed = true;
      if (alive) setState('fallback');
      renderer.current?.dispose();
      renderer.current = null;
    };
    const empty: EffectController = { pause() {}, pulse() {}, dispose() {} };
    const initialize = async () => {
      if (mask?.current) {
        await document.fonts.ready;
        if (!alive) return empty;
        applyMask(canvas, mask.current, text);
      }
      if (kind === 'dither') {
        const rendererModule = await import('./effects/canvas-renderer');
        return alive
          ? rendererModule.createCanvasRenderer(
              canvas,
              layout === 'page' ? document.documentElement : host,
              layout
            )
          : empty;
      }
      const rendererModule = await import('./effects/hologram-renderer');
      return alive ? rendererModule.createHologramRenderer(canvas, host, failed) : empty;
    };
    const dispose = ownAsync(
      initialize(),
      (value) => {
        if (hasFailed) {
          value.dispose();
          return;
        }
        renderer.current = value;
        value.pause(preference.current);
        setState('live');
      },
      failed
    );
    const unsubscribe = subscribe(() => {
      if (alive && mask?.current) {
        try {
          applyMask(canvas, mask.current, text);
        } catch {
          failed();
        }
      }
    });
    return () => {
      alive = false;
      unsubscribe();
      dispose();
      renderer.current = null;
    };
  }, [kind, region, mask, text, layout]);
  return (
    <div
      className={`${styles.effect} ${kind === 'dither' ? (layout === 'page' ? styles.pageDither : styles.dither) : styles.lettering}`}
      data-render-state={state}
      aria-hidden="true"
    >
      {kind === 'dither' && <div className={styles.fallback} />}
      <canvas ref={canvasRef} data-effect={layout === 'page' ? 'page-dither' : kind} />
    </div>
  );
}
