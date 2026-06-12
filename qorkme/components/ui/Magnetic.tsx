'use client';

import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import { useMagnetic } from '@/lib/motion/useMagnetic';
import styles from './Magnetic.module.css';

type MagneticProps = {
  children: ReactNode;
  /** Max pull in px. */
  strength?: number;
  className?: string;
};

/**
 * Magnetic wrapper — owns its own transform so the pull NEVER shares a node
 * with Framer Motion (whileTap) or anime.js targets inside. Pairs with the
 * cursor's [data-magnetic] ring-docking (set that on the child, not here).
 */
const Magnetic: FC<MagneticProps> = ({ children, strength = 6, className }) => {
  const ref = useMagnetic<HTMLSpanElement>(strength);
  return (
    <span ref={ref} className={clsx(styles.magnetic, className)}>
      {children}
    </span>
  );
};

export default Magnetic;
