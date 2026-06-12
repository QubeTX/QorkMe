import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

interface HealthStats {
  url_count: number;
  active_url_count: number;
  inactive_url_count: number;
  click_count: number;
  reserved_word_count: number;
  newest_url_at: string | null;
  newest_click_at: string | null;
  latest_access_at: string | null;
}

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const adminClient = await createAdminClient();
    const start = Date.now();

    // Single round trip — admin_health_stats aggregates everything server-side
    // (service-role only; EXECUTE is revoked from anon/authenticated)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any).rpc('admin_health_stats');

    const latencyMs = Date.now() - start;

    if (error || !data) {
      return NextResponse.json({
        status: 'error',
        latencyMs,
        error: error?.message ?? 'Health stats unavailable',
      });
    }

    const stats = data as HealthStats;

    let status: 'operational' | 'degraded' | 'error' = 'operational';
    if (latencyMs > 2000) status = 'degraded';

    return NextResponse.json({
      status,
      latencyMs,
      tables: {
        urls: stats.url_count ?? 0,
        clicks: stats.click_count ?? 0,
        reserved_words: stats.reserved_word_count ?? 0,
      },
      activeUrls: stats.active_url_count ?? 0,
      inactiveUrls: stats.inactive_url_count ?? 0,
      freshness: {
        newestUrl: stats.newest_url_at ?? null,
        newestClick: stats.newest_click_at ?? null,
        latestAccess: stats.latest_access_at ?? null,
      },
      error: null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Health check failed';
    return NextResponse.json({ status: 'error', latencyMs: 0, error: message }, { status: 500 });
  }
}
