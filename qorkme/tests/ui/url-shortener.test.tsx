import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

const { pushMock } = vi.hoisted(() => ({
  pushMock: vi.fn(),
}));

const { toastErrorMock, toastSuccessMock } = vi.hoisted(() => ({
  toastErrorMock: vi.fn(),
  toastSuccessMock: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: pushMock,
  }),
}));

vi.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: toastErrorMock,
    success: toastSuccessMock,
  },
}));

import { UrlShortener } from '@/components/UrlShortener';

describe('UrlShortener', () => {
  beforeEach(() => {
    pushMock.mockReset();
    toastErrorMock.mockReset();
    toastSuccessMock.mockReset();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('shows an error toast when submitting without a URL', async () => {
    const user = userEvent.setup();
    render(<UrlShortener />);

    const form = document.querySelector('form');
    form?.setAttribute('novalidate', '');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Please enter a URL');
    });
    expect(pushMock).not.toHaveBeenCalled();
  });

  it('submits the URL and routes to the result page on success', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123', shortCode: 'fresh' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(
      screen.getByLabelText(/destination url/i),
      'https://incredible.example/landing'
    );

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(pushMock).toHaveBeenCalledWith('/result/123?code=fresh');
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://incredible.example/landing', customAlias: null }),
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('checks custom alias availability and surfaces the API response', async () => {
    const user = userEvent.setup();
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce({ json: async () => ({ available: true }) })
      .mockResolvedValueOnce({ json: async () => ({ available: false, error: 'taken' }) });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.click(screen.getByRole('button', { name: /add a custom alias/i }));

    const aliasInput = screen.getByRole('textbox', { name: /custom alias/i });
    const checkButton = screen.getByRole('button', { name: /^check$/i });

    await user.type(aliasInput, 'stellar');
    await waitFor(() => {
      expect(checkButton).toBeEnabled();
    });
    await user.click(checkButton);

    await waitFor(() => {
      expect(toastSuccessMock).toHaveBeenCalledWith('This alias is available!');
    });

    await user.clear(aliasInput);
    await user.type(aliasInput, 'taken');
    await waitFor(() => {
      expect(checkButton).toBeEnabled();
    });
    await user.click(checkButton);

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('taken');
    });

    expect(fetchMock).toHaveBeenNthCalledWith(1, '/api/shorten?alias=stellar');
    expect(fetchMock).toHaveBeenNthCalledWith(2, '/api/shorten?alias=taken');
  });
});
