'use client';

import { useId, useState, useEffect, useRef, type FC, type ReactNode } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { Copy } from '@/components/ui/icons';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import { useMotionPreference } from '@/components/brand/MotionPreference';
import styles from './InstallBlock.module.css';

export type InstallTarget = {
  id: string;
  /** Tab label — stored sentence case, uppercased by CSS. */
  label: string;
  command: string;
  /** Optional mono note under the command (requirements, scope). */
  note?: string;
  /**
   * QorkMe divergence: optional content rendered inside the panel when this
   * target is the active tab — used by /install to surface the native Windows
   * installers right beneath the Windows command. Generic ReactNode so the kit
   * component stays presentation-agnostic.
   */
  extra?: ReactNode;
};

type InstallBlockProps = {
  targets: InstallTarget[];
  /** Terminal-style header label. */
  title?: string;
  detectPlatform?: boolean;
};

/**
 * The canonical install section for every product page: OS tab pills
 * (FM layoutId underline), a prompt-prefixed command line, and the copy
 * button whose label slot-rolls Copy → Copied — the micro-interaction the
 * slot roll was born for. Generalized from reports.qubetx.com INITIALIZE,
 * v3 tokens.
 */
const InstallBlock: FC<InstallBlockProps> = ({
  targets,
  title = 'Install',
  detectPlatform = false,
}) => {
  const [activeId, setActiveId] = useState(targets[0]?.id);
  const groupId = useId();
  const active = targets.find((t) => t.id === activeId) ?? targets[0];
  const [copyRef, copyLabel] = useSlotRoll('Copy');
  const previousTarget = useRef(activeId);
  const { paused } = useMotionPreference();
  useEffect(() => {
    if (detectPlatform && /Windows/i.test(navigator.userAgent)) setActiveId('windows');
  }, [detectPlatform]);
  useEffect(() => {
    if (previousTarget.current !== activeId) copyLabel.set('Copy');
    previousTarget.current = activeId;
  }, [activeId, copyLabel]);

  const onCopy = async () => {
    try {
      await navigator.clipboard.writeText(active.command);
      copyLabel.flash('Copied', { enter: { interrupt: true } });
    } catch {
      copyLabel.flash('Failed', { enter: { interrupt: true } });
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
              tabIndex={target.id === active.id ? 0 : -1}
              aria-controls={`${groupId}-panel`}
              className={clsx(styles.tab, target.id === active.id && styles.tabActive)}
              onClick={() => setActiveId(target.id)}
              onKeyDown={(event) => {
                const index = targets.findIndex((item) => item.id === target.id);
                const next =
                  event.key === 'Home'
                    ? 0
                    : event.key === 'End'
                      ? targets.length - 1
                      : event.key === 'ArrowRight'
                        ? (index + 1) % targets.length
                        : event.key === 'ArrowLeft'
                          ? (index - 1 + targets.length) % targets.length
                          : -1;
                if (next < 0) return;
                event.preventDefault();
                setActiveId(targets[next].id);
                document.getElementById(`${groupId}-tab-${targets[next].id}`)?.focus();
              }}
              data-interactive="true"
            >
              {target.id === active.id && (
                <motion.span
                  layoutId={`${groupId}-active`}
                  className={styles.tabFill}
                  transition={
                    paused ? { duration: 0 } : { type: 'spring', stiffness: 500, damping: 38 }
                  }
                  aria-hidden="true"
                />
              )}
              <span className={styles.tabLabel}>{target.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div role="tabpanel" id={`${groupId}-panel`} aria-labelledby={`${groupId}-tab-${active.id}`}>
        <div className={styles.panel}>
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
        {active.extra}
      </div>
    </div>
  );
};

export default InstallBlock;
