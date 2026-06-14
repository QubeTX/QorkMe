'use client';

import { useEffect, useState } from 'react';

const FALLBACK = '1.0.0';

/**
 * Tiny live version badge: fetches the latest GitHub release tag for the qork
 * CLI, strips a leading `v`, and renders `v<version>`. Falls back to the
 * hardcoded release on error so the badge always reads cleanly (no spinner,
 * no layout shift — the fallback is the server-rendered value).
 */
export default function LatestVersion({ className }: { className?: string }) {
  const [version, setVersion] = useState(FALLBACK);

  useEffect(() => {
    let active = true;
    fetch('https://api.github.com/repos/QubeTX/qork/releases/latest')
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tag_name?: string } | null) => {
        if (!active || !data?.tag_name) return;
        setVersion(data.tag_name.replace(/^v/, '') || FALLBACK);
      })
      .catch(() => {
        /* keep the fallback */
      });
    return () => {
      active = false;
    };
  }, []);

  return <span className={className}>v{version}</span>;
}
