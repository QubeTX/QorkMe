'use client';

import { motion, useScroll } from 'framer-motion';

/**
 * 2px brand-gradient reading-progress bar pinned above the header.
 * FM MotionValue drives scaleX directly — zero React re-renders.
 */
export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();

  return (
    <motion.div
      aria-hidden="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 2,
        background: 'linear-gradient(90deg, #2563eb, #7c3aed)',
        transformOrigin: 'left',
        scaleX: scrollYProgress,
        zIndex: 110,
        pointerEvents: 'none',
      }}
    />
  );
}
