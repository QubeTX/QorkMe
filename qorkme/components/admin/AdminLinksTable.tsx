'use client';

import { useCallback, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';
import {
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  Trash2,
  Link as LinkIcon,
} from 'lucide-react';

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

type SortColumn = 'created_at' | 'short_code' | 'click_count' | 'is_active';

const SHORT_DOMAIN =
  typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me' : 'qork.me';

function truncateUrl(url: string, max = 40): string {
  if (url.length <= max) return url;
  return url.slice(0, max - 1) + '\u2026';
}

function formatDate(iso: string): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(iso));
}

function DeleteLinkButton({
  id,
  shortCode,
  onDeleted,
}: {
  id: string;
  shortCode: string;
  onDeleted: () => void;
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
        toast.success(`Deleted /${shortCode}`);
        onDeleted();
      } else {
        toast.error(json.message || 'Delete failed');
      }
    } catch {
      toast.error('Network error');
    } finally {
      setDeleting(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="inline-flex items-center justify-center rounded-md p-1.5 text-[color:var(--color-text-muted)] transition-colors hover:bg-[color:var(--color-error)]/10 hover:text-[color:var(--color-error)] disabled:opacity-50"
      aria-label={`Delete /${shortCode}`}
    >
      {deleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
    </button>
  );
}

export function AdminLinksTable() {
  const [links, setLinks] = useState<LinksResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [sort, setSort] = useState<SortColumn>('created_at');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: String(page),
        pageSize: '25',
        sort,
        order,
      });
      const res = await fetch(`/api/admin/links?${params}`);
      if (res.ok) {
        setLinks(await res.json());
      }
    } catch {
      // Network error
    } finally {
      setLoading(false);
    }
  }, [page, sort, order]);

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

  const cardStyle = {
    background: 'var(--color-surface)',
    borderColor: 'var(--color-border)',
    boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
  };

  const SortButton = ({ col, children }: { col: SortColumn; children: React.ReactNode }) => (
    <button
      onClick={() => toggleSort(col)}
      className="inline-flex items-center gap-1 text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)] hover:text-[color:var(--color-text-primary)] transition-colors"
    >
      {children}
      <ArrowUpDown
        size={12}
        className={sort === col ? 'text-[color:var(--color-primary)]' : 'opacity-40'}
      />
    </button>
  );

  return (
    <Card style={cardStyle} hoverable={false}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>All Short Links</CardTitle>
        <LinkIcon size={22} className="text-[color:var(--color-accent)]" aria-hidden="true" />
      </CardHeader>
      <CardContent className="pt-6">
        {loading && !links ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={24} className="animate-spin text-[color:var(--color-text-muted)]" />
          </div>
        ) : !links || links.data.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12 text-center">
            <LinkIcon size={32} className="text-[color:var(--color-text-muted)]" />
            <p className="text-sm text-[color:var(--color-text-muted)]">No links yet</p>
          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b" style={{ borderColor: 'var(--color-border)' }}>
                    <th className="pb-3 text-left">
                      <SortButton col="short_code">Code</SortButton>
                    </th>
                    <th className="pb-3 text-left">
                      <span className="text-xs font-medium uppercase tracking-wider text-[color:var(--color-text-muted)]">
                        Destination
                      </span>
                    </th>
                    <th className="pb-3 text-right">
                      <SortButton col="click_count">Clicks</SortButton>
                    </th>
                    <th className="pb-3 text-left">
                      <SortButton col="created_at">Created</SortButton>
                    </th>
                    <th className="pb-3 text-center">
                      <SortButton col="is_active">Status</SortButton>
                    </th>
                    <th className="pb-3 text-right">
                      <span className="sr-only">Actions</span>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {links.data.map((link) => (
                    <tr
                      key={link.id}
                      className="border-b transition-colors hover:bg-[color:var(--color-surface-muted)]/30"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--color-border) 50%, transparent)',
                      }}
                    >
                      <td className="py-3 pr-4">
                        <a
                          href={`https://${SHORT_DOMAIN}/${link.short_code}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-mono text-[color:var(--color-primary)] hover:underline"
                        >
                          /{link.short_code}
                          <ExternalLink size={10} className="opacity-50" />
                        </a>
                      </td>
                      <td className="py-3 pr-4">
                        <span
                          className="text-[color:var(--color-text-secondary)]"
                          title={link.long_url}
                        >
                          {truncateUrl(link.long_url)}
                        </span>
                      </td>
                      <td className="py-3 pr-4 text-right font-mono text-[color:var(--color-text-primary)]">
                        {link.click_count.toLocaleString()}
                      </td>
                      <td className="py-3 pr-4 text-[color:var(--color-text-muted)]">
                        {formatDate(link.created_at)}
                      </td>
                      <td className="py-3 pr-4 text-center">
                        <span
                          className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium"
                          style={{
                            background: link.is_active
                              ? 'color-mix(in srgb, var(--color-success) 12%, transparent)'
                              : 'color-mix(in srgb, var(--color-text-muted) 12%, transparent)',
                            color: link.is_active
                              ? 'var(--color-success)'
                              : 'var(--color-text-muted)',
                          }}
                        >
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full"
                            style={{
                              background: link.is_active
                                ? 'var(--color-success)'
                                : 'var(--color-text-muted)',
                            }}
                          />
                          {link.is_active ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 text-right">
                        <DeleteLinkButton
                          id={link.id}
                          shortCode={link.short_code}
                          onDeleted={fetchLinks}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Card Layout */}
            <div className="flex flex-col gap-3 md:hidden">
              {links.data.map((link) => (
                <div
                  key={link.id}
                  className="rounded-lg border p-4"
                  style={{
                    borderColor: 'var(--color-border)',
                    background: 'var(--color-surface-muted)',
                  }}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex flex-col gap-1 min-w-0">
                      <a
                        href={`https://${SHORT_DOMAIN}/${link.short_code}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 font-mono text-sm text-[color:var(--color-primary)] hover:underline"
                      >
                        /{link.short_code}
                        <ExternalLink size={10} className="opacity-50" />
                      </a>
                      <p
                        className="text-xs text-[color:var(--color-text-muted)] truncate"
                        title={link.long_url}
                      >
                        {link.long_url}
                      </p>
                    </div>
                    <DeleteLinkButton
                      id={link.id}
                      shortCode={link.short_code}
                      onDeleted={fetchLinks}
                    />
                  </div>
                  <div className="mt-3 flex items-center gap-4 text-xs text-[color:var(--color-text-muted)]">
                    <span className="font-mono">{link.click_count} clicks</span>
                    <span>{formatDate(link.created_at)}</span>
                    <span
                      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5"
                      style={{
                        background: link.is_active
                          ? 'color-mix(in srgb, var(--color-success) 12%, transparent)'
                          : 'color-mix(in srgb, var(--color-text-muted) 12%, transparent)',
                        color: link.is_active ? 'var(--color-success)' : 'var(--color-text-muted)',
                      }}
                    >
                      <span
                        className="inline-block h-1 w-1 rounded-full"
                        style={{
                          background: link.is_active
                            ? 'var(--color-success)'
                            : 'var(--color-text-muted)',
                        }}
                      />
                      {link.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {links.totalPages > 1 && (
              <div className="mt-6 flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1 || loading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft size={14} />
                  Previous
                </Button>
                <span className="text-sm text-[color:var(--color-text-muted)]">
                  Page {links.page} of {links.totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= links.totalPages || loading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                  <ChevronRight size={14} />
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
