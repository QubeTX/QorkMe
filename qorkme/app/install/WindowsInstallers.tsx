'use client';

import { Fragment } from 'react';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import styles from './install.module.css';

// Version-agnostic permalinks (always resolve to the latest release).
const RELEASE_BASE = 'https://github.com/QubeTX/qork/releases/latest/download/';

type Row = { scope: string; desc: string; msi: string; exe: string };

const ROWS: Row[] = [
  {
    scope: 'All users',
    desc: 'Requires administrator access.',
    msi: 'qork-x86_64-pc-windows-msvc.msi',
    exe: 'qork-x86_64-pc-windows-msvc-setup.exe',
  },
  {
    scope: 'Just me',
    desc: 'No administrator access needed.',
    msi: 'qork-x86_64-pc-windows-msvc-corporate.msi',
    exe: 'qork-x86_64-pc-windows-msvc-corporate-setup.exe',
  },
];

/** Keep the download format legible while the arrow rolls on hover. */
function WinButton({
  href,
  file,
  label,
  ariaLabel,
}: {
  href: string;
  file: string;
  label: string;
  ariaLabel: string;
}) {
  const [labelRef, slot] = useSlotRoll(label, { direction: 'up' });
  const showVersion = () => slot.set(label.replace('↓', '↘'));
  const showLabel = () => slot.set(label);
  return (
    <a
      className={styles.winBtn}
      href={href}
      download={file}
      aria-label={ariaLabel}
      data-interactive="true"
      onPointerEnter={(e) => e.pointerType === 'mouse' && showVersion()}
      onPointerLeave={(e) => e.pointerType === 'mouse' && showLabel()}
      onFocus={showVersion}
      onBlur={showLabel}
    >
      <span ref={labelRef}>{label}</span>
    </a>
  );
}

/**
 * The native Windows installers, surfaced inline under the Windows tab of the
 * install block (the full installers section still lives further down the page).
 */
export default function WindowsInstallers() {
  return (
    <div className={styles.winInstallers}>
      <p className={styles.winInstallersNote}>
        Prefer a setup wizard? Choose EXE. Use MSI if your IT team manages software installs.
      </p>
      <div className={styles.winGrid}>
        {ROWS.map(({ scope, desc, msi, exe }) => (
          <Fragment key={scope}>
            <span className={styles.winScope}>{scope}</span>
            <span className={styles.winScopeDesc}>{desc}</span>
            <div className={styles.winBtns}>
              <WinButton
                href={`${RELEASE_BASE}${msi}`}
                file={msi}
                label="↓ MSI"
                ariaLabel={`Download ${scope} MSI installer`}
              />
              <WinButton
                href={`${RELEASE_BASE}${exe}`}
                file={exe}
                label="↓ EXE"
                ariaLabel={`Download ${scope} EXE installer`}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
