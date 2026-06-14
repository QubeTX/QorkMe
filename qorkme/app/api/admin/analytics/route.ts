import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

// Dashboard visualizations — one round trip via the admin_analytics() RPC
// (service-role only). Returns 14-day click/creation series, top links,
// device breakdown, and window totals.
export async function GET() {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

  try {
    const adminClient = await createAdminClient();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (adminClient as any).rpc('admin_analytics');
    if (error || !data) {
      return NextResponse.json(
        { error: error?.message ?? 'Analytics unavailable' },
        { status: 500 }
      );
    }
    return NextResponse.json(data);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Analytics failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
