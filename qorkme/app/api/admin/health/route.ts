import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const adminClient = await createAdminClient();
    const start = Date.now();

    const [
      urlCount,
      activeUrlCount,
      inactiveUrlCount,
      clickCount,
      reservedCount,
      newestUrl,
      newestClick,
      latestAccess,
    ] = await Promise.all([
      adminClient.from('urls').select('id', { count: 'exact', head: true }),
      adminClient.from('urls').select('id', { count: 'exact', head: true }).eq('is_active', true),
      adminClient.from('urls').select('id', { count: 'exact', head: true }).eq('is_active', false),
      adminClient.from('clicks').select('id', { count: 'exact', head: true }),
      adminClient.from('reserved_words').select('word', { count: 'exact', head: true }),
      adminClient
        .from('urls')
        .select('created_at')
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      adminClient
        .from('clicks')
        .select('clicked_at')
        .order('clicked_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      adminClient
        .from('urls')
        .select('last_accessed_at')
        .not('last_accessed_at', 'is', null)
        .order('last_accessed_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
    ]);

    const latencyMs = Date.now() - start;

    const hasError = urlCount.error || clickCount.error || reservedCount.error;

    let status: 'operational' | 'degraded' | 'error' = 'operational';
    if (hasError) status = 'error';
    else if (latencyMs > 2000) status = 'degraded';

    return NextResponse.json({
      status,
      latencyMs,
      tables: {
        urls: urlCount.count ?? 0,
        clicks: clickCount.count ?? 0,
        reserved_words: reservedCount.count ?? 0,
      },
      activeUrls: activeUrlCount.count ?? 0,
      inactiveUrls: inactiveUrlCount.count ?? 0,
      freshness: {
        newestUrl: (newestUrl.data as { created_at: string } | null)?.created_at ?? null,
        newestClick: (newestClick.data as { clicked_at: string } | null)?.clicked_at ?? null,
        latestAccess:
          (latestAccess.data as { last_accessed_at: string } | null)?.last_accessed_at ?? null,
      },
      error: hasError
        ? urlCount.error?.message || clickCount.error?.message || reservedCount.error?.message
        : null,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Health check failed';
    return NextResponse.json({ status: 'error', latencyMs: 0, error: message }, { status: 500 });
  }
}
