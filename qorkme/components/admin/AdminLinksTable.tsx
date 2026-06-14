'use client';

import { useCallback, useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Search,
  Trash2,
} from 'lucide-react';
import styles from './admin.module.css';

interface LinkRow {
  id: string;
  short_code: string;
  long_url: string;
  click_count: number;
  created_at: string;
  is_active: boolean;
  custom_alias: boolean;
  last_accessed_at: string | null;
}

interface LinksResponse {
  data: LinkRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

type SortColumn = 'created_at' | 'short_code' | 'click_count' | 'last_accessed_at';
type StatusFilter = 'all' | 'active' | 'inactive' | 'alias';

const SHORT_DOMAIN = process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me';
const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'active', label: 'Active' },
  { key: 'inactive', label: 'Off' },
  { key: 'alias', label: 'Alias' },
];

function truncateUrl(url: string, max = 48): string {
  return url.length <= max ? url : url.slice(0, max - 1) + '…';
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

function relativeTime(iso: string | null): string {
  if (!iso) return 'never';
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  return `${Math.floor(days / 30)}mo ago`;
}

function DeleteButton({
  id,
  shortCode,
  onDeleted,
  onStatus,
}: {
  id: string;
  shortCode: string;
  onDeleted: () => void;
  onStatus: (message: string, tone: 'ok' | 'error') => void;
}) {
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (!window.confirm(`Delete /${shortCode} and all its click data? This cannot be undone.`)) {
      return;
    }
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/links/${id}`, { method: 'DELETE' });
      const json = await res.json();
      if (res.ok && json.success) {
        onStatus(`DELETED /${shortCode}`, 'ok');
        onDeleted();
      } else {
        onStatus(json.message || 'Delete failed', 'error');
      }
    } catch {
      onStatus('Network error', 'error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className={styles.delBtn}
      aria-label={`Delete /${shortCode}`}
    >
      {deleting ? (
        <Loader2 size={14} className={styles.spin} aria-hidden="true" />
      ) : (
        <Trash2 size={14} aria-hidden="true" />
      )}
    </button>
  );
}

export function AdminLinksTable() {
  const [links, setLinks] = useState<LinksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortColumn>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [search, setSearch] = useState('');
  const [debounced, setDebounced] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [purging, setPurging] = useState(false);
  const [status, setStatus] = useState<{ message: string; tone: 'ok' | 'error' } | null>(null);

  // Debounce the search box
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search.trim()), 300);
    return () => clearTimeout(t);
  }, [search]);

  // Any filter/search change returns to page 1
  useEffect(() => {
    setPage(1);
  }, [debounced, statusFilter]);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page: String(page), pageSize: '25', sort, order });
      if (debounced) params.set('q', debounced);
      if (statusFilter === 'active') params.set('status', 'active');
      else if (statusFilter === 'inactive') params.set('status', 'inactive');
      else if (statusFilter === 'alias') params.set('alias', 'true');
      const res = await fetch(`/api/admin/links?${params}`);
      if (res.ok) setLinks(await res.json());
    } catch {
      /* network error */
    } finally {
      setLoading(false);
    }
  }, [page, sort, order, debounced, statusFilter]);

  useEffect(() => {
    fetchLinks();
  }, [fetchLinks]);

  const toggleSort = (col: SortColumn) => {
    if (sort === col) {
      setOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSort(col);
      setOrder('desc');
    }
    setPage(1);
  };

  const handleClearAll = async () => {
    if (
      !window.confirm(
        'Permanently delete ALL links and their click analytics? This cannot be undone.'
      )
    ) {
      return;
    }
    if (window.prompt('Type DELETE to purge every stored URL.') !== 'DELETE') {
      setStatus({ message: 'PURGE ABORTED // CONFIRMATION MISMATCH', tone: 'error' });
      return;
    }
    setPurging(true);
    try {
      const res = await fetch('/api/admin/purge', { method: 'POST' });
      const json = await res.json().catch(() => ({}));
      if (res.ok && json.success !== false) {
        setStatus({ message: 'PURGE COMPLETE // ALL DATA CLEARED', tone: 'ok' });
        setPage(1);
        fetchLinks();
      } else {
        setStatus({ message: json.message || 'Purge failed', tone: 'error' });
      }
    } catch {
      setStatus({ message: 'Network error', tone: 'error' });
    } finally {
      setPurging(false);
    }
  };

  const maxClicks = links?.data?.length ? Math.max(...links.data.map((l) => l.click_count), 1) : 1;

  const Sort = ({ col, children }: { col: SortColumn; children: React.ReactNode }) => {
    const active = sort === col;
    const Icon = active ? (order === 'asc' ? ArrowUp : ArrowDown) : ArrowUpDown;
    return (
      <button
        type="button"
        onClick={() => toggleSort(col)}
        className={`${styles.sortBtn} ${active ? styles.sortActive : ''}`}
      >
        {children}
        <Icon size={11} style={{ opacity: active ? 1 : 0.4 }} aria-hidden="true" />
      </button>
    );
  };

  return (
    <section className={styles.panel} aria-label="Short links">
      <div className={styles.panelHead}>
        <span className={styles.panelTitle}>
          LINKS // <b>{links ? links.total.toLocaleString() : '—'}</b>
        </span>
        <button
          type="button"
          className={styles.clearAllBtn}
          onClick={handleClearAll}
          disabled={purging}
        >
          {purging ? (
            <Loader2 size={12} className={styles.spin} aria-hidden="true" />
          ) : (
            <Trash2 size={12} aria-hidden="true" />
          )}
          Clear all
        </button>
      </div>

      {/* Toolbar: search + status filter */}
      <div className={styles.toolbar}>
        <label className={styles.search}>
          <span className="sr-only">Search links</span>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search
              size={14}
              aria-hidden="true"
              style={{
                position: 'absolute',
                left: 12,
                color: 'var(--color-text-dim)',
                pointerEvents: 'none',
              }}
            />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Filter by code or destination…"
              className={styles.searchInput}
              style={{ paddingLeft: 34 }}
            />
          </div>
        </label>
        <div className={styles.segGroup} role="group" aria-label="Status filter">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              type="button"
              className={`${styles.segBtn} ${statusFilter === f.key ? styles.segActive : ''}`}
              onClick={() => setStatusFilter(f.key)}
              aria-pressed={statusFilter === f.key}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {status && (
        <p
          role="status"
          className={styles.statusLine}
          style={{
            color: status.tone === 'ok' ? 'var(--color-arrival)' : 'var(--color-error)',
            paddingTop: 12,
          }}
        >
          {status.tone === 'ok' ? '' : 'ERR // '}
          {status.message}
        </p>
      )}

      {loading && !links ? (
        <div className={styles.center}>
          <Loader2 size={20} className={styles.spin} aria-hidden="true" />
          <span className={styles.muted}>LOADING…</span>
        </div>
      ) : !links || links.data.length === 0 ? (
        <div className={styles.center}>
          <span className={styles.muted}>
            {debounced || statusFilter !== 'all' ? 'NO MATCHING LINKS' : 'NO LINKS YET'}
          </span>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>
                    <Sort col="short_code">Code</Sort>
                  </th>
                  <th>Destination</th>
                  <th className={styles.alignRight}>
                    <Sort col="click_count">Clicks</Sort>
                  </th>
                  <th>Status</th>
                  <th>
                    <Sort col="created_at">Created</Sort>
                  </th>
                  <th>
                    <Sort col="last_accessed_at">Last active</Sort>
                  </th>
                  <th className={styles.alignRight}>
                    <span className="sr-only">Actions</span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {links.data.map((link) => (
                  <tr key={link.id}>
                    <td>
                      <a
                        href={`https://${SHORT_DOMAIN}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.code}
                      >
                        /{link.short_code}
                        <ExternalLink size={11} style={{ opacity: 0.5 }} aria-hidden="true" />
                      </a>
                      {link.custom_alias && <span className={styles.aliasChip}>alias</span>}
                    </td>
                    <td>
                      <span className={styles.dest} title={link.long_url}>
                        {truncateUrl(link.long_url)}
                      </span>
                    </td>
                    <td className={styles.alignRight}>
                      <div className={styles.clicks}>
                        <span
                          className={styles.clickBar}
                          style={{ width: `${Math.max((link.click_count / maxClicks) * 100, 6)}%` }}
                          aria-hidden="true"
                        />
                        <span className={styles.clickNum}>{link.click_count.toLocaleString()}</span>
                      </div>
                    </td>
                    <td>
                      <span
                        className={`${styles.statusTag} ${
                          link.is_active ? styles.statusActive : styles.statusInactive
                        }`}
                      >
                        {link.is_active ? 'active' : 'off'}
                      </span>
                    </td>
                    <td className={styles.cellDim}>{formatDate(link.created_at)}</td>
                    <td className={styles.cellDim}>{relativeTime(link.last_accessed_at)}</td>
                    <td className={styles.alignRight}>
                      <DeleteButton
                        id={link.id}
                        shortCode={link.short_code}
                        onDeleted={fetchLinks}
                        onStatus={(message, tone) => setStatus({ message, tone })}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className={styles.mList}>
            {links.data.map((link) => (
              <div key={link.id} className={styles.mCard}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex min-w-0 flex-col gap-1">
                    <a
                      href={`https://${SHORT_DOMAIN}/${link.short_code}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.code}
                    >
                      /{link.short_code}
                      <ExternalLink size={10} style={{ opacity: 0.5 }} aria-hidden="true" />
                    </a>
                    <span className={`${styles.dest} truncate`} title={link.long_url}>
                      {link.long_url}
                    </span>
                  </div>
                  <DeleteButton
                    id={link.id}
                    shortCode={link.short_code}
                    onDeleted={fetchLinks}
                    onStatus={(message, tone) => setStatus({ message, tone })}
                  />
                </div>
                <div className={styles.mMeta}>
                  <span className={styles.cellDim}>{link.click_count.toLocaleString()} clicks</span>
                  <span className={styles.cellDim}>{formatDate(link.created_at)}</span>
                  <span className={styles.cellDim}>{relativeTime(link.last_accessed_at)}</span>
                  <span
                    className={`${styles.statusTag} ${
                      link.is_active ? styles.statusActive : styles.statusInactive
                    }`}
                  >
                    {link.is_active ? 'active' : 'off'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.pager}>
            <span className={styles.resultCount}>
              SHOWING {links.data.length} / {links.total.toLocaleString()}
            </span>
            {links.totalPages > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={13} aria-hidden="true" />
                  Prev
                </button>
                <span className={styles.pageInfo}>
                  PAGE {links.page} / {links.totalPages}
                </span>
                <button
                  type="button"
                  className={styles.pagerBtn}
                  disabled={page >= links.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={13} aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}
