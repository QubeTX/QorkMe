import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { AdminLinksTable } from '@/components/admin/AdminLinksTable';

const { refreshPage, refreshLinks } = vi.hoisted(() => ({
  refreshPage: vi.fn(),
  refreshLinks: vi.fn(),
}));
vi.mock('next/navigation', () => ({ useRouter: () => ({ refresh: refreshPage }) }));
vi.mock('@/hooks/useAdminResource', () => ({
  useAdminResource: () => ({
    data: { data: [], total: 0, page: 1, pageSize: 25, totalPages: 0 },
    loading: false,
    error: '',
    refresh: refreshLinks,
  }),
}));

describe('admin delete-all flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    vi.spyOn(window, 'prompt').mockReturnValue('DELETE');
  });
  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });
  const clickClear = () => {
    render(<AdminLinksTable />);
    fireEvent.click(screen.getByText('Delete all links'));
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
  };

  it('does not send a request when the typed confirmation is cancelled', () => {
    vi.mocked(window.prompt).mockReturnValue(null);
    const request = vi.fn();
    vi.stubGlobal('fetch', request);
    clickClear();
    expect(request).not.toHaveBeenCalled();
    expect(refreshPage).not.toHaveBeenCalled();
  });

  it('reports failure, permits retry, and refreshes summary and table only after success', async () => {
    const request = vi
      .fn()
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({ success: false, message: 'Could not clear the links. Please retry.' }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, deleted: { urls: 1, clicks: 2 } }),
      });
    vi.stubGlobal('fetch', request);
    clickClear();
    await screen.findByText(/Could not clear the links/);
    expect(refreshPage).not.toHaveBeenCalled();
    expect(refreshLinks).not.toHaveBeenCalled();
    expect(screen.getByRole('button', { name: 'Clear all' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Clear all' }));
    await screen.findByText('All links deleted.');
    await waitFor(() => expect(refreshPage).toHaveBeenCalledOnce());
    expect(refreshLinks).toHaveBeenCalledOnce();
    expect(request).toHaveBeenLastCalledWith('/api/admin/purge', { method: 'POST' });
  });

  it('does not claim deletion on a malformed successful HTTP response', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: true, json: async () => ({}) }));
    clickClear();
    await screen.findByText(/Purge failed/);
    expect(refreshPage).not.toHaveBeenCalled();
    expect(refreshLinks).not.toHaveBeenCalled();
  });
});
