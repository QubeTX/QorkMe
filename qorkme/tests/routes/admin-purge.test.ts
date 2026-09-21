import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextResponse } from 'next/server';
const { rpc, auth, revalidate } = vi.hoisted(() => ({
  rpc: vi.fn(),
  auth: vi.fn(),
  revalidate: vi.fn(),
}));
vi.mock('@/lib/supabase/server', () => ({ createAdminClient: async () => ({ rpc }) }));
vi.mock('@/lib/admin/auth', () => ({ verifyAdminAuth: auth }));
vi.mock('next/cache', () => ({ revalidatePath: revalidate }));
import { POST } from '@/app/api/admin/purge/route';
describe('admin purge', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    auth.mockResolvedValue({ authorized: true });
  });
  it('rejects anonymous callers before touching data', async () => {
    auth.mockResolvedValue({ authorized: false, response: NextResponse.json({}, { status: 401 }) });
    expect((await POST()).status).toBe(401);
    expect(rpc).not.toHaveBeenCalled();
  });
  it('uses one atomic database operation and returns actual deleted counts', async () => {
    rpc.mockResolvedValue({ data: { urls: 8, clicks: 21 }, error: null });
    const response = await POST();
    expect(await response.json()).toEqual({ success: true, deleted: { urls: 8, clicks: 21 } });
    expect(rpc).toHaveBeenCalledOnce();
    expect(rpc).toHaveBeenCalledWith('admin_purge_links');
    expect(revalidate).toHaveBeenCalledWith('/admin');
  });
  it('does not report success or refresh the page when the transaction fails', async () => {
    rpc.mockResolvedValue({ data: null, error: { code: '57014' } });
    const response = await POST();
    expect(response.status).toBe(500);
    expect((await response.json()).success).toBe(false);
    expect(revalidate).not.toHaveBeenCalled();
  });
});
