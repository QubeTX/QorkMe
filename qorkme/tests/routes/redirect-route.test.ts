import { beforeEach, describe, expect, it, vi } from 'vitest';
import { NextRequest } from 'next/server';

const { rpc, insert, tasks } = vi.hoisted(() => ({
  rpc: vi.fn(),
  insert: vi.fn(),
  tasks: [] as Array<() => Promise<void>>,
}));
vi.mock('@/lib/supabase/server', () => ({
  createAnonClient: async () => ({ rpc, from: () => ({ insert }) }),
}));
vi.mock('next/server', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/server')>()),
  after: (task: () => Promise<void>) => tasks.push(task),
}));
import { GET } from '@/app/[shortCode]/route';

const request = () => new NextRequest('https://qork.me/HELLO?utm_source=' + 'a'.repeat(120));
const context = { params: Promise.resolve({ shortCode: 'HELLO' }) };
describe('redirect correctness', () => {
  beforeEach(() => {
    rpc.mockReset();
    insert.mockReset();
    tasks.length = 0;
    insert.mockResolvedValue({ error: null });
  });
  it('checks current state and increments every visit instead of caching stale destinations', async () => {
    rpc.mockResolvedValue({
      data: [{ id: 'link-id', long_url: 'https://example.com/target' }],
      error: null,
    });
    for (let i = 0; i < 2; i++) {
      const response = await GET(request(), context);
      expect(response.status).toBe(307);
      expect(response.headers.get('location')).toBe('https://example.com/target');
      expect(response.headers.get('cache-control')).toBe('no-store');
    }
    expect(rpc).toHaveBeenCalledTimes(2);
    expect(tasks).toHaveLength(2);
    await tasks[0]();
    expect(insert).toHaveBeenCalledWith(
      expect.objectContaining({ url_id: 'link-id', utm_source: 'a'.repeat(100) })
    );
  });
  it('sends missing, disabled and expired links to the HTML 404 page', async () => {
    rpc.mockResolvedValue({ data: [], error: null });
    const response = await GET(request(), context);
    expect(response.headers.get('location')).toBe('https://qork.me/link-not-found');
    expect(tasks).toHaveLength(0);
  });
  it('returns a retryable 503 for database failure, rather than pretending a link is missing', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    rpc.mockResolvedValue({ data: null, error: { code: '57014' } });
    const response = await GET(request(), context);
    expect(response.status).toBe(503);
    expect(response.headers.get('retry-after')).toBe('10');
    expect(tasks).toHaveLength(0);
    log.mockRestore();
  });
  it('keeps the redirect successful if the optional analytics insert fails', async () => {
    const log = vi.spyOn(console, 'error').mockImplementation(() => {});
    rpc.mockResolvedValue({
      data: [{ id: 'link-id', long_url: 'https://example.com' }],
      error: null,
    });
    insert.mockRejectedValue(new Error('offline'));
    expect((await GET(request(), context)).status).toBe(307);
    await expect(tasks[0]()).resolves.toBeUndefined();
    log.mockRestore();
  });
});
