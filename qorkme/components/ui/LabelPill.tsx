import type { FC, ReactNode } from 'react';
import clsx from 'clsx';
import styles from './LabelPill.module.css';

type LabelPillProps = {
  children: ReactNode;
  /** 'pill' = bordered chip (section labels); 'bar' = blue left bar (hero eyebrow) */
  variant?: 'pill' | 'bar';
  className?: string;
};

/**
 * Mono uppercase label (machine-report standard).
 * Letter-spaced — intentionally NOT Pretext-measured (canvas measurement
 * ignores letter-spacing).
 */
const LabelPill: FC<LabelPillProps> = ({ children, variant = 'pill', className }) => (
  <span className={clsx(styles.label, styles[variant], className)}>{children}</span>
);

export default LabelPill;
