'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';
import { useMotionPreference } from './MotionPreference';
import { createPointerTrail } from './effects/pointer-trail';
import styles from './DitherTrail.module.css';

export function DitherTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const { paused } = useMotionPreference();
  const pathname = usePathname();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || paused) return;
    const pointer = matchMedia('(hover: hover) and (pointer: fine)');
    let renderer: ReturnType<typeof createPointerTrail> | undefined;
    const update = () => {
      renderer?.dispose();
      renderer = undefined;
      canvas.hidden = !pointer.matches;
      if (!pointer.matches) return;
      try {
        renderer = createPointerTrail(canvas);
      } catch {
        // This optional decoration never gates navigation or the form.
        canvas.hidden = true;
      }
    };
    update();
    pointer.addEventListener('change', update);
    return () => {
      renderer?.dispose();
      canvas.hidden = true;
      pointer.removeEventListener('change', update);
    };
  }, [paused, pathname]);

  return <canvas ref={canvasRef} className={styles.trail} aria-hidden="true" hidden />;
}
