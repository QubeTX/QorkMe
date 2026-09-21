'use client';
import { useEffect, useState } from 'react';
/** Keep release information honest when GitHub is unavailable. */
export default function LatestVersion({ className }: { className?: string }) {
  const [version, setVersion] = useState<string | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    fetch('https://api.github.com/repos/QubeTX/qork/releases/latest', { signal: controller.signal })
      .then((res) => (res.ok ? res.json() : null))
      .then((data: { tag_name?: string } | null) => {
        if (!controller.signal.aborted && data?.tag_name && /^v?\d+\.\d+\.\d+/.test(data.tag_name))
          setVersion(data.tag_name);
      })
      .catch(() => {});
    return () => controller.abort();
  }, []);
  return (
    <a href="https://github.com/QubeTX/qork/releases/latest" className={className}>
      {version ? `${version} · Release notes ↗` : 'Latest release ↗'}
    </a>
  );
}
