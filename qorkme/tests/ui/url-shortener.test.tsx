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

  it('submits the URL and displays the shortened result', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: '123', shortCode: 'fresh' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(
      screen.getByLabelText(/enter your url/i),
      'https://incredible.example/landing'
    );

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByText(/your shortened url/i)).toBeInTheDocument();
      expect(screen.getByText(/qork\.me\/fresh/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/shorten', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: 'https://incredible.example/landing' }),
    });
    expect(toastErrorMock).not.toHaveBeenCalled();
  });

  it('displays error toast when API request fails', async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Invalid URL format' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(
      screen.getByLabelText(/enter your url/i),
      'https://example.com'
    );

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith('Invalid URL format');
    });
  });
});
