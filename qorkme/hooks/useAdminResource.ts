'use client';

import { useCallback, useEffect, useState } from 'react';

/** One in-flight request per panel; old filters and unmounted panels cannot win. */
export function useAdminResource<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const refresh = useCallback(() => setRevision((value) => value + 1), []);
  useEffect(() => {
    const controller = new AbortController();
    let active = true;
    setLoading(true);
    setError('');
    setData(null);
    const timeout = setTimeout(() => controller.abort(), 12000);
    void (async () => {
      try {
        const response = await fetch(url, { signal: controller.signal, cache: 'no-store' });
        if (!response.ok)
          throw new Error(
            response.status === 401 || response.status === 403
              ? 'Your session has ended. Please sign in again.'
              : 'Could not load this data. Please try again.'
          );
        const json = await response.json();
        if (active) setData(json);
      } catch (cause) {
        if (active)
          setError(
            controller.signal.aborted
              ? 'The request timed out. Please try again.'
              : cause instanceof Error
                ? cause.message
                : 'Could not connect. Please try again.'
          );
      } finally {
        clearTimeout(timeout);
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
      clearTimeout(timeout);
      controller.abort();
    };
  }, [url, revision]);
  return { data, loading, error, refresh };
}
