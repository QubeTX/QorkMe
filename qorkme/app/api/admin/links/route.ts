import { NextRequest, NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/server';
import { verifyAdminAuth } from '@/lib/admin/auth';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const auth = await verifyAdminAuth();
  if (!auth.authorized) return auth.response;

  const { searchParams } = request.nextUrl;
  const page = Math.max(1, parseInt(searchParams.get('page') || '1', 10));
  const pageSize = Math.min(100, Math.max(1, parseInt(searchParams.get('pageSize') || '25', 10)));
  const sort = searchParams.get('sort') || 'created_at';
  const order = searchParams.get('order') === 'asc' ? true : false;

  // Filters
  // Strip PostgREST-significant characters from the search term so it can't
  // break the `.or()` filter grammar; cap the length.
  const q = (searchParams.get('q') || '')
    .replace(/[,()%*\\]/g, '')
    .trim()
    .slice(0, 100);
  const status = searchParams.get('status'); // 'active' | 'inactive'
  const alias = searchParams.get('alias'); // 'true'

  const allowedSortColumns = [
    'created_at',
    'short_code',
    'click_count',
    'is_active',
    'last_accessed_at',
  ];
  const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';

  const offset = (page - 1) * pageSize;
  const filtered = Boolean(q) || status === 'active' || status === 'inactive' || alias === 'true';

  try {
    const adminClient = await createAdminClient();

    // Exact count when filtered (so pagination is correct); estimated otherwise
    // (reads pg_class.reltuples instead of scanning the table at scale).
    let query = adminClient
      .from('urls')
      .select(
        'id, short_code, long_url, click_count, created_at, is_active, custom_alias, last_accessed_at',
        { count: filtered ? 'exact' : 'estimated' }
      );

    if (q) query = query.or(`short_code.ilike.%${q}%,long_url.ilike.%${q}%`);
    if (status === 'active') query = query.eq('is_active', true);
    else if (status === 'inactive') query = query.eq('is_active', false);
    if (alias === 'true') query = query.eq('custom_alias', true);

    const { data, error, count } = await query
      .order(sortColumn, { ascending: order })
      .range(offset, offset + pageSize - 1);

    if (error) {
      return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }

    return NextResponse.json({
      data: data ?? [],
      total: count ?? 0,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil((count ?? 0) / pageSize)),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch links';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
