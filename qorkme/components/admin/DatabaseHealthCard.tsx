'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Activity, Database, RefreshCw, Clock, Loader2 } from 'lucide-react';

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
  if (!iso) return 'Never';
  const diff = Date.now() - new Date(iso).getTime();
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const statusConfig = {
  operational: {
    color: 'var(--color-success)',
    bg: 'color-mix(in srgb, var(--color-success) 12%, transparent)',
    label: 'Operational',
  },
  degraded: {
    color: 'var(--color-warning)',
    bg: 'color-mix(in srgb, var(--color-warning) 12%, transparent)',
    label: 'Degraded',
  },
  error: {
    color: 'var(--color-error)',
    bg: 'color-mix(in srgb, var(--color-error) 12%, transparent)',
    label: 'Error',
  },
};

export function DatabaseHealthCard() {
  const [data, setData] = useState<HealthData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchHealth = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/health');
      if (res.ok) {
        setData(await res.json());
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
  }, [fetchHealth]);

  const cardStyle = {
    background: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
  };

  if (loading && !data) {
    return (
      <Card style={cardStyle} hoverable={false}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Database Health</CardTitle>
          <Database size={22} className="text-[color:var(--color-accent)]" aria-hidden="true" />
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 size={24} className="animate-spin text-[color:var(--color-text-muted)]" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) return null;

  const cfg = statusConfig[data.status];
  const totalUrls = data.tables.urls;
  const activeRatio = totalUrls > 0 ? (data.activeUrls / totalUrls) * 100 : 0;
  const maxLatency = 3000;
  const latencyPct = Math.min((data.latencyMs / maxLatency) * 100, 100);

  return (
    <Card style={cardStyle} hoverable={false}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Database Health</CardTitle>
        <Button
          variant="ghost"
          size="sm"
          onClick={fetchHealth}
          disabled={loading}
          aria-label="Refresh health data"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-6 pt-6">
        {/* Status + Latency Row */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center gap-2 rounded-full px-3 py-1.5"
              style={{ background: cfg.bg }}
            >
              <span
                className="inline-block h-2.5 w-2.5 rounded-full"
                style={{ background: cfg.color }}
              />
              <span className="text-sm font-medium" style={{ color: cfg.color }}>
                {cfg.label}
              </span>
            </div>
          </div>

          {/* Latency */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[color:var(--color-text-muted)]">Response</span>
              <span className="font-mono text-[color:var(--color-text-primary)]">
                {data.latencyMs}ms
              </span>
            </div>
            <div
              className="h-1.5 w-full overflow-hidden rounded-full"
              style={{ background: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${latencyPct}%`,
                  background:
                    data.latencyMs < 500
                      ? 'var(--color-success)'
                      : data.latencyMs < 2000
                        ? 'var(--color-warning)'
                        : 'var(--color-error)',
                }}
              />
            </div>
          </div>
        </div>

        {/* Table Row Counts */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Table Rows
          </p>
          <div className="grid grid-cols-3 gap-3">
            {(
              [
                ['URLs', data.tables.urls, Database],
                ['Clicks', data.tables.clicks, Activity],
                ['Reserved', data.tables.reserved_words, Clock],
              ] as const
            ).map(([label, count, Icon]) => (
              <div
                key={label}
                className="flex flex-col items-center gap-1 rounded-lg p-3"
                style={{ background: 'var(--color-surface-muted)' }}
              >
                <Icon
                  size={14}
                  className="text-[color:var(--color-text-muted)]"
                  aria-hidden="true"
                />
                <span className="text-lg font-semibold text-[color:var(--color-text-primary)]">
                  {count.toLocaleString()}
                </span>
                <span className="text-xs text-[color:var(--color-text-muted)]">{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Active / Inactive Ratio */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Active / Inactive
          </p>
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-[color:var(--color-success)]">
              {data.activeUrls}
            </span>
            <div
              className="h-2 flex-1 overflow-hidden rounded-full"
              style={{ background: 'var(--color-border)' }}
            >
              <div
                className="h-full rounded-full transition-all duration-500"
                style={{
                  width: `${activeRatio}%`,
                  background: 'var(--color-success)',
                }}
              />
            </div>
            <span className="text-sm font-mono text-[color:var(--color-text-muted)]">
              {data.inactiveUrls}
            </span>
          </div>
        </div>

        {/* Data Freshness */}
        <div>
          <p className="mb-3 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
            Data Freshness
          </p>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                ['Newest URL', data.freshness.newestUrl],
                ['Last Click', data.freshness.newestClick],
                ['Last Access', data.freshness.latestAccess],
              ] as const
            ).map(([label, ts]) => (
              <div
                key={label}
                className="flex items-center justify-between gap-2 sm:flex-col sm:items-center"
              >
                <span className="text-xs text-[color:var(--color-text-muted)]">{label}</span>
                <span className="text-sm font-mono text-[color:var(--color-text-primary)]">
                  {relativeTime(ts)}
                </span>
              </div>
            ))}
          </div>
        </div>

        {data.error && <p className="text-sm text-[color:var(--color-error)]">{data.error}</p>}
      </CardContent>
    </Card>
  );
}
