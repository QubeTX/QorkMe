'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

export function UrlShortener() {
  const [url, setUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${data.shortCode}`;
      toast.success(`Shortened: ${shortUrl}`);
      setUrl('');
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      id="url-shortener-card"
      className="url-shortener-card flex flex-col gap-6 rounded-[30px] border border-white/10 bg-[color:var(--color-surface)]/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl"
      style={{ padding: '48px' }}
    >
      <div id="input-wrapper" className="input-wrapper">
        <Input
          id="url-input"
          type="url"
          placeholder="Enter Your URL — https://example.com/your/very/long/url/here..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyPress={handleKeyPress}
          className="url-input w-full rounded-2xl border-2 border-white/10 bg-[rgba(20,20,19,0.4)] px-6 py-5 text-lg text-text-primary backdrop-blur-sm placeholder:text-text-muted focus:border-[color:var(--color-primary)] focus:bg-[rgba(20,20,19,0.6)] focus:shadow-[0_0_0_4px_rgba(196,114,79,0.1)] focus:outline-none"
          required
        />
      </div>
      <Button
        id="shorten-button"
        onClick={handleSubmit}
        className="shorten-button w-full rounded-2xl border-none bg-gradient-to-br from-[color:var(--color-primary)] to-[#c56647] px-5 py-6 font-ui text-lg font-semibold text-text-inverse shadow-[0_4px_20px_rgba(196,114,79,0.3),inset_0_1px_0_rgba(255,255,255,0.2)]"
      >
        Shorten URL
      </Button>
    </div>
  );
}
