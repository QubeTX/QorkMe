'use client';

import { useId, useState, type FC } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Copy } from '@/components/ui/icons';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import styles from './InstallBlock.module.css';

export type InstallTarget = {
  id: string;
  /** Tab label — stored sentence case, uppercased by CSS. */
  label: string;
  command: string;
  /** Optional mono note under the command (requirements, scope). */
  note?: string;
};

type InstallBlockProps = {
  targets: InstallTarget[];
  /** Terminal-style header label. */
  title?: string;
};

/**
 * The canonical install section for every product page: OS tab pills
 * (FM layoutId underline), a prompt-prefixed command line, and the copy
 * button whose label slot-rolls Copy → Copied — the micro-interaction the
 * slot roll was born for. Generalized from reports.qubetx.com INITIALIZE,
 * v3 tokens.
 */
const InstallBlock: FC<InstallBlockProps> = ({ targets, title = 'Initialize' }) => {
  const [activeId, setActiveId] = useState(targets[0]?.id);
  const groupId = useId();
  const active = targets.find((t) => t.id === activeId) ?? targets[0];
  const [copyRef, copyLabel] = useSlotRoll('Copy');

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.command);
      copyLabel.flash('Copied');
    } catch {
      copyLabel.flash('Failed'); // clipboard unavailable (permissions/http)
    }
  };

  return (
    <div className={styles.block}>
      <div className={styles.header}>
        <span>{title}</span>
        <div className={styles.tabs} role="tablist" aria-label="Install target">
          {targets.map((target) => (
            <button
              key={target.id}
              type="button"
              role="tab"
              id={`${groupId}-tab-${target.id}`}
              aria-selected={target.id === active.id}
              aria-controls={`${groupId}-panel`}
              className={clsx(styles.tab, target.id === active.id && styles.tabActive)}
              onClick={() => setActiveId(target.id)}
              data-interactive="true"
            >
              {target.id === active.id && (
                <motion.span
                  layoutId={`${groupId}-active`}
                  className={styles.tabFill}
                  transition={{ type: 'spring', stiffness: 500, damping: 38 }}
                  aria-hidden="true"
                />
              )}
              <span className={styles.tabLabel}>{target.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div
        className={styles.panel}
        role="tabpanel"
        id={`${groupId}-panel`}
        aria-labelledby={`${groupId}-tab-${active.id}`}
      >
        <code className={styles.command}>
          <span className={styles.prompt} aria-hidden="true">
            ${' '}
          </span>
          {active.command}
        </code>
        <button type="button" className={styles.copy} onClick={onCopy} data-interactive="true">
          <Copy size={14} strokeWidth={2} aria-hidden="true" />
          <span ref={copyRef} className={styles.copyLabel}>
            Copy
          </span>
        </button>
      </div>

      {active.note && <p className={styles.note}>{active.note}</p>}
    </div>
  );
};

export default InstallBlock;
