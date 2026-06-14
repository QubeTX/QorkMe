'use client';

import { useCallback, useEffect, useState } from 'react';
import { RefreshCw } from 'lucide-react';
import styles from './admin.module.css';

interface DayPoint {
  d: string;
  c: number;
}

interface Analytics {
  clicks_by_day: DayPoint[];
  created_by_day: DayPoint[];
  top_links: { short_code: string; click_count: number }[];
  device_breakdown: { device: string; c: number }[];
  totals: { clicks_14d: number; links_14d: number };
}

const SHORT_DOMAIN = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me';

function dayNum(iso: string): string {
  const parts = iso.split('-');
  return parts.length === 3 ? String(parseInt(parts[2], 10)) : iso;
}

/** 14-column bar chart (pure HTML/CSS — crisp, responsive, no chart lib). */
function BarChart({ data, label, total }: { data: DayPoint[]; label: string; total: number }) {
  const max = Math.max(1, ...data.map((p) => p.c));
  return (
    <div className={styles.vizCard}>
      <div className={styles.vizHead}>
        <span className={styles.kvLabel}>{label}</span>
        <span className={styles.vizTotal}>{total.toLocaleString()}</span>
      </div>
      <div className={styles.chart} role="img" aria-label={`${label}: ${total} over 14 days`}>
        {data.map((p) => (
          <div key={p.d} className={styles.barCol} title={`${p.d} · ${p.c}`}>
            <div
              className={styles.bar}
              style={{ height: p.c > 0 ? `${Math.max(4, (p.c / max) * 100)}%` : '0' }}
            />
          </div>
        ))}
      </div>
      <div className={styles.chartAxis}>
        <span>{data[0] ? dayNum(data[0].d) : ''}</span>
        <span>{data[7] ? dayNum(data[7].d) : ''}</span>
        <span>{data[data.length - 1] ? dayNum(data[data.length - 1].d) : ''}</span>
      </div>
    </div>
  );
}

export function AdminAnalytics() {
  const [data, setData] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/analytics');
      if (res.ok) setData(await res.json());
    } catch {
      /* network error */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const topMax = data ? Math.max(1, ...data.top_links.map((l) => l.click_count)) : 1;
  const deviceTotal = data ? data.device_breakdown.reduce((s, d) => s + d.c, 0) : 0;

  return (
    <section className={styles.panel} aria-label="Analytics">
      <div className={styles.panelHead}>
        <span className={styles.panelTitle}>
          ANALYTICS // <b>14-DAY WINDOW</b>
        </span>
        <button
          type="button"
          className={styles.iconBtn}
          onClick={fetchAnalytics}
          disabled={loading}
          aria-label="Refresh analytics"
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
            <div className={styles.vizGrid}>
              <BarChart data={data.clicks_by_day} label="Clicks" total={data.totals.clicks_14d} />
              <BarChart
                data={data.created_by_day}
                label="New links"
                total={data.totals.links_14d}
              />

              {/* Top links */}
              <div className={styles.vizCard}>
                <div className={styles.vizHead}>
                  <span className={styles.kvLabel}>Top links by clicks</span>
                </div>
                {data.top_links.length === 0 ? (
                  <span className={styles.muted}>No links yet</span>
                ) : (
                  <div className={styles.rankList}>
                    {data.top_links.map((l) => (
                      <a
                        key={l.short_code}
                        href={`https://${SHORT_DOMAIN}/${l.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.rankRow}
                        title={`/${l.short_code} · ${l.click_count} clicks`}
                      >
                        <span className={styles.rankCode}>/{l.short_code}</span>
                        <span className={styles.rankTrack}>
                          <span
                            className={styles.rankFill}
                            style={{ width: `${Math.max(3, (l.click_count / topMax) * 100)}%` }}
                          />
                        </span>
                        <span className={styles.rankNum}>{l.click_count.toLocaleString()}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Device breakdown */}
              <div className={styles.vizCard}>
                <div className={styles.vizHead}>
                  <span className={styles.kvLabel}>Clicks by device</span>
                </div>
                {deviceTotal === 0 ? (
                  <span className={styles.muted}>No clicks yet</span>
                ) : (
                  <div className={styles.rankList}>
                    {data.device_breakdown.map((d) => {
                      const pct = Math.round((d.c / deviceTotal) * 100);
                      return (
                        <div key={d.device} className={styles.rankRow}>
                          <span className={styles.rankLabel}>{d.device}</span>
                          <span className={styles.rankTrack}>
                            <span
                              className={styles.rankFill}
                              style={{ width: `${Math.max(3, pct)}%` }}
                            />
                          </span>
                          <span className={styles.rankNum}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
