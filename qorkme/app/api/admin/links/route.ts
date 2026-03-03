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

  const allowedSortColumns = [
    'created_at',
    'short_code',
    'click_count',
    'is_active',
    'last_accessed_at',
  ];
  const sortColumn = allowedSortColumns.includes(sort) ? sort : 'created_at';

  const offset = (page - 1) * pageSize;

  try {
    const adminClient = await createAdminClient();

    const { data, error, count } = await adminClient
      .from('urls')
      .select(
        'id, short_code, long_url, click_count, created_at, is_active, custom_alias, last_accessed_at',
        { count: 'exact' }
      )
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
      totalPages: Math.ceil((count ?? 0) / pageSize),
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to fetch links';
    return NextResponse.json({ success: false, message }, { status: 500 });
  }
}
