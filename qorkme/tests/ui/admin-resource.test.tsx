import { act, renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { useAdminResource } from '@/hooks/useAdminResource';

afterEach(() => vi.unstubAllGlobals());
describe('admin request ownership', () => {
  it('aborts an old filter and ignores its late result', async () => {
    let complete!: (response: object) => void;
    const fetchMock = vi
      .fn()
      .mockImplementationOnce(
        () =>
          new Promise((resolve) => {
            complete = resolve;
          })
      )
      .mockResolvedValueOnce({ ok: true, json: async () => ({ name: 'current' }) });
    vi.stubGlobal('fetch', fetchMock);
    const { result, rerender, unmount } = renderHook(
      ({ url }) => useAdminResource<{ name: string }>(url),
      { initialProps: { url: '/api/admin/links?q=first' } }
    );
    const firstSignal = fetchMock.mock.calls[0][1].signal;
    rerender({ url: '/api/admin/links?q=second' });
    await waitFor(() => expect(result.current.data?.name).toBe('current'));
    expect(firstSignal.aborted).toBe(true);
    await act(async () => {
      complete({ ok: true, json: async () => ({ name: 'stale' }) });
    });
    expect(result.current.data?.name).toBe('current');
    unmount();
    expect(fetchMock.mock.calls[1][1].signal.aborted).toBe(true);
  });
  it('reports a failed request and can recover on retry', async () => {
    vi.stubGlobal(
      'fetch',
      vi
        .fn()
        .mockResolvedValueOnce({ ok: false, status: 500 })
        .mockResolvedValueOnce({ ok: true, json: async () => ({ name: 'loaded' }) })
    );
    const { result } = renderHook(() => useAdminResource<{ name: string }>('/api/admin/health'));
    await waitFor(() => expect(result.current.loading).toBe(false));
    expect(result.current.error).toMatch(/try again/i);
    act(() => result.current.refresh());
    await waitFor(() => expect(result.current.data?.name).toBe('loaded'));
    expect(result.current.error).toBe('');
  });
});
