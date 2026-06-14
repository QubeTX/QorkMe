'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './admin.module.css';

interface HealthData {
  status: 'operational' | 'degraded' | 'error';
  latencyMs: number;
  tables: {
    urls: number;
    clicks: number;
    reserved_words: number;
  };
  activeUrls: number;
  inactiveUrls: number;
  freshness: {
    newestUrl: string | null;
    newestClick: string | null;
    latestAccess: string | null;
  };
  error: string | null;
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const STATUS = {
  operational: { color: 'var(--color-success)', label: 'OPERATIONAL' },
  degraded: { color: 'var(--color-warning)', label: 'DEGRADED' },
  error: { color: 'var(--color-error)', label: 'ERROR' },
} as const;

export function DatabaseHealthCard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/health');
      if (res.ok) setData(await res.json());
    } catch {
      /* network error — leave prior data */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const cfg = data ? STATUS[data.status] : STATUS.operational;
  const totalUrls = data?.tables.urls ?? 0;
  const activeRatio = totalUrls > 0 ? ((data?.activeUrls ?? 0) / totalUrls) * 100 : 0;
  const latencyPct = data ? Math.min((data.latencyMs / 3000) * 100, 100) : 0;
  const latencyColor = !data
    ? 'var(--color-border)'
    : data.latencyMs < 500
      ? 'var(--color-success)'
      : data.latencyMs < 2000
        ? 'var(--color-warning)'
        : 'var(--color-error)';

  return (
    <section className={styles.panel} aria-label="Database health">
      <div className={styles.panelHead}>
        <span className={styles.panelTitle}>
          SYSTEM // <b>DATABASE</b>
        </span>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={fetchHealth}
          disabled={loading}
          aria-label="Refresh health data"
        >
          <RefreshCw size={15} className={loading ? styles.spin : undefined} aria-hidden="true" />
        </button>
      </div>

      <div className={styles.panelBody}>
        {!data ? (
          <div className={styles.center}>
            <RefreshCw size={20} className={styles.spin} aria-hidden="true" />
            <span className={styles.muted}>QUERYING…</span>
          </div>
        ) : (
          <>
            <div className={styles.healthTop}>
              <span className={styles.statusChip} style={{ color: cfg.color }}>
                <span className={styles.statusDot} aria-hidden="true" />
                {cfg.label}
              </span>
              <div className={styles.latency}>
                <div className={styles.latencyRow}>
                  <span className={styles.kvLabel}>Response latency</span>
                  <span className={styles.kvValue}>{data.latencyMs}ms</span>
                </div>
                <div className={styles.meter}>
                  <div
                    className={styles.meterFill}
                    style={{ width: `${latencyPct}%`, background: latencyColor }}
                  />
                </div>
              </div>
            </div>

            <p className={styles.sectionLabel}>Table rows</p>
            <div className={styles.hGrid}>
              {(
                [
                  ['urls', data.tables.urls],
                  ['clicks', data.tables.clicks],
                  ['reserved', data.tables.reserved_words],
                ] as const
              ).map(([label, count]) => (
                <div key={label} className={styles.hCell}>
                  <span className={styles.hCellNum}>{count.toLocaleString()}</span>
                  <span className={styles.kvLabel}>{label}</span>
                </div>
              ))}
            </div>

            <p className={styles.sectionLabel}>
              Active / inactive · {data.activeUrls} of {totalUrls}
            </p>
            <div className={styles.meter}>
              <div
                className={styles.meterFill}
                style={{ width: `${activeRatio}%`, background: 'var(--color-success)' }}
              />
            </div>

            <p className={styles.sectionLabel}>Data freshness</p>
            <div className={styles.hGrid}>
              {(
                [
                  ['newest url', data.freshness.newestUrl],
                  ['last click', data.freshness.newestClick],
                  ['last access', data.freshness.latestAccess],
                ] as const
              ).map(([label, ts]) => (
                <div key={label} className={styles.hCell}>
                  <span className={styles.kvValue}>{relativeTime(ts)}</span>
                  <span className={styles.kvLabel}>{label}</span>
                </div>
              ))}
            </div>

            {data.error && (
              <p
                className={styles.statusLine}
                style={{ color: 'var(--color-error)', paddingTop: 16 }}
              >
                ERR // {data.error}
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
