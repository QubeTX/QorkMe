'use client';

import { Fragment, useEffect, useState } from 'react';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import styles from './install.module.css';

// Version-agnostic permalinks (always resolve to the latest release).
const RELEASE_BASE = 'https://github.com/QubeTX/qork/releases/latest/download/';
// Falls back to the current release so the hover label reads cleanly if the
// GitHub API call fails; the fetch corrects it to the true latest on mount.
const FALLBACK_VERSION = '1.1.1';

type Row = { scope: string; desc: string; msi: string; exe: string };

const ROWS: Row[] = [
  {
    scope: 'Global',
    desc: 'Per-machine → Program Files. Needs admin.',
    msi: 'qork-x86_64-pc-windows-msvc.msi',
    exe: 'qork-x86_64-pc-windows-msvc-setup.exe',
  },
  {
    scope: 'Corporate',
    desc: 'Per-user → %LocalAppData%. No admin.',
    msi: 'qork-x86_64-pc-windows-msvc-corporate.msi',
    exe: 'qork-x86_64-pc-windows-msvc-corporate-setup.exe',
  },
];

/** Latest qork release tag (`vX.Y.Z` → `X.Y.Z`), fetched once. */
function useLatestVersion() {
  const [version, setVersion] = useState(FALLBACK_VERSION);
  useEffect(() => {
    let active = true;
    fetch('https://api.github.com/repos/QubeTX/qork/releases/latest')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tag_name?: string } | null) => {
        if (active && data?.tag_name) {
          setVersion(data.tag_name.replace(/^v/, '') || FALLBACK_VERSION);
        }
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      active = false;
    };
  }, []);
  return version;
}

/**
 * A prominent Windows download button whose label slot-rolls into the current
 * release version (`↓ MSI` → `v1.1.1`) on hover/focus and rolls back on
 * leave/blur — so you see exactly which release you're about to download.
 */
function WinButton({
  href,
  file,
  label,
  ariaLabel,
  version,
}: {
  href: string;
  file: string;
  label: string;
  ariaLabel: string;
  version: string;
}) {
  const [labelRef, slot] = useSlotRoll(label, { direction: 'up' });
  const showVersion = () => slot.set(`v${version}`);
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
  const version = useLatestVersion();
  return (
    <div className={styles.winInstallers}>
      <p className={styles.winInstallersNote}>
        Prefer a double-click installer (or no Rust on the machine)? Grab a prebuilt Windows
        installer below — same binary, packaged. Pick one format per edition; hover a button to see
        the release it installs.
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
                version={version}
              />
              <WinButton
                href={`${RELEASE_BASE}${exe}`}
                file={exe}
                label="↓ EXE"
                ariaLabel={`Download ${scope} EXE installer`}
                version={version}
              />
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
