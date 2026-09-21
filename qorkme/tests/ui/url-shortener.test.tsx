import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

import { UrlShortener } from '@/components/UrlShortener';

describe('UrlShortener', () => {
  beforeEach(() => {
    pushMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('shows an inline error when submitting without a URL', async () => {
    const user = userEvent.setup();
    render(<UrlShortener />);

    const form = document.querySelector('form');
    form?.setAttribute('novalidate', '');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Please enter a URL');
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submits the URL and displays the shortened result', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123', shortCode: 'fresh', href: 'https://qork.me/fresh' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(screen.getByLabelText(/your long link/i), 'https://incredible.example/landing');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByRole('status')).toHaveTextContent('Your short link is ready');
      // The short URL lands in the slot roll's accessible-name node
      expect(screen.getByText(/qork\.me\/fresh/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/shorten', {
      signal: expect.any(AbortSignal),
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://incredible.example/landing', source: 'web' }),
    });
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('displays an inline error when the API request fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid URL format' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(screen.getByLabelText(/your long link/i), 'https://example.com');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid URL format');
    });
  });

  it('never copies automatically and only confirms a successful explicit clipboard write', async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, 'writeText')
      .mockRejectedValueOnce(new Error('denied'))
      .mockResolvedValue(undefined);
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue({ ok: true, json: async () => ({ href: 'https://qork.me/demo' }) })
    );
    render(<UrlShortener />);
    await user.type(screen.getByLabelText(/your long link/i), 'https://example.com');
    await user.click(screen.getByRole('button', { name: /shorten url/i }));
    const copy = await screen.findByRole('button', { name: 'Copy' });
    expect(writeText).not.toHaveBeenCalled();
    await user.click(copy);
    expect(await screen.findByRole('button', { name: 'Try again' })).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('Could not copy');
    await user.click(copy);
    expect(await screen.findByRole('button', { name: 'Copied' })).toBeInTheDocument();
    expect(writeText).toHaveBeenLastCalledWith('https://qork.me/demo');
  });

  it('aborts an in-flight request on unmount', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockReturnValue(new Promise(() => {}));
    vi.stubGlobal('fetch', fetchMock);
    const view = render(<UrlShortener />);
    await user.type(screen.getByLabelText(/your long link/i), 'https://example.com');
    await user.click(screen.getByRole('button', { name: /shorten url/i }));
    const signal = fetchMock.mock.calls[0][1].signal;
    view.unmount();
    expect(signal.aborted).toBe(true);
  });
});
