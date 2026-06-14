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
      json: async () => ({ id: '123', shortCode: 'fresh' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<UrlShortener />);

    await user.type(screen.getByLabelText(/enter your url/i), 'https://incredible.example/landing');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByText(/link created/i)).toBeInTheDocument();
      // The short URL lands in the slot roll's accessible-name node
      expect(screen.getByText(/qork\.me\/fresh/i)).toBeInTheDocument();
    });

    expect(fetchMock).toHaveBeenCalledWith('/api/shorten', {
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

    await user.type(screen.getByLabelText(/enter your url/i), 'https://example.com');

    await user.click(screen.getByRole('button', { name: /shorten url/i }));

    await waitFor(() => {
      expect(screen.getByRole('alert')).toHaveTextContent('Invalid URL format');
    });
  });
});
