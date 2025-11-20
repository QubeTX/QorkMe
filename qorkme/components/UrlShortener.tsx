'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { TiltWrapper } from '@/components/ui/tilt-wrapper';
import toast from 'react-hot-toast';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [shortUrl, setShortUrl] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success('Copied to clipboard!');
    } catch (error) {
      console.error('Failed to copy:', error);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Start fade out
    setFadeState('out');

    // Wait for fade out animation
    setTimeout(async () => {
      setIsLoading(true);

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

        const generatedShortUrl = `https://${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${data.shortCode}`;
        setShortUrl(generatedShortUrl);

        // Auto-copy to clipboard
        await copyToClipboard(generatedShortUrl);

        // Show result view
        setIsLoading(false);
        setShowResult(true);
        setFadeState('in');

        // Clear the input for next time
        setUrl('');
      } catch (error) {
        console.error('Error shortening URL:', error);
        toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');

        // Reset to input view on error
        setIsLoading(false);
        setFadeState('in');
      }
    }, 200); // Match fadeOut duration
  };

  const handleReset = () => {
    setFadeState('out');
    setTimeout(() => {
      setShowResult(false);
      setShortUrl('');
      setFadeState('in');
    }, 200);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <TiltWrapper className="w-full max-w-[700px] mx-auto perspective-1000" rotationFactor={35}>
      <div
        id="url-shortener-card"
        className="url-shortener-card relative flex flex-col gap-6 rounded-[30px] border border-white/10 bg-[color:var(--color-surface)]/[0.03] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)] backdrop-blur-xl overflow-hidden"
        style={{ padding: '24px' }}
      >
        {/* Shimmering Border Beam */}
        <div className="absolute inset-0 pointer-events-none rounded-[30px] overflow-hidden">
          <div className="absolute -inset-[100%] bg-gradient-to-r from-transparent via-white/10 to-transparent rotate-45 animate-[shimmer_4s_infinite_linear] w-[200%]" />
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="flex min-h-[200px] items-center justify-center relative z-10">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-[color:var(--color-surface-muted)] border-t-[color:var(--color-primary)]" />
              <p className="font-ui text-sm text-[color:var(--color-text-muted)]">
                Creating your short link...
              </p>
            </div>
          </div>
        )}

        {/* Success State */}
        {!isLoading && showResult && (
          <div
            className={`flex flex-col gap-6 transition-opacity duration-300 relative z-10 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}
          >
            <div className="flex flex-col gap-4 rounded-[20px] bg-[color:var(--color-surface-elevated)]/[0.15] p-8 backdrop-blur-sm border border-white/5">
              <div className="flex items-center gap-2">
                <svg
                  className="h-6 w-6 text-[color:var(--color-success)]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <p className="font-ui text-sm font-medium text-[color:var(--color-success)]">
                  Link created successfully!
                </p>
              </div>

              <div className="flex flex-col gap-2">
                <p className="font-ui text-xs text-[color:var(--color-text-muted)]">
                  Your short link:
                </p>
                <div className="flex items-center gap-3 rounded-xl bg-[rgba(255,255,255,0.05)] p-4 border border-white/5">
                  <p className="flex-1 font-mono text-lg text-[color:var(--color-text-primary)] break-all">
                    {shortUrl}
                  </p>
                  <button
                    onClick={() => copyToClipboard(shortUrl)}
                    className="flex-shrink-0 rounded-lg bg-[color:var(--color-primary)]/20 p-2 text-[color:var(--color-primary)] transition-colors hover:bg-[color:var(--color-primary)]/30"
                    aria-label="Copy to clipboard"
                  >
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <Button
              onClick={handleReset}
              className="w-full rounded-2xl border-none bg-gradient-to-br from-[color:var(--color-primary)] to-[#c56647] px-5 py-6 font-ui text-lg font-semibold text-text-inverse shadow-[0_4px_20px_rgba(196,114,79,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden group"
            >
              <span className="relative z-10">Shorten Another URL</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Button>
          </div>
        )}

        {/* Input State */}
        {!isLoading && !showResult && (
          <div
            className={`flex flex-col gap-6 transition-opacity duration-200 relative z-10 ${fadeState === 'in' ? 'opacity-100' : 'opacity-0'}`}
          >
            <div id="input-wrapper" className="input-wrapper">
              <label htmlFor="url-input" className="sr-only">
                Enter Your URL
              </label>
              <Input
                id="url-input"
                type="url"
                placeholder="Enter Your URL — https://example.com/your/very/long/url/here..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={handleKeyPress}
                className="url-input w-full rounded-2xl border-2 border-white/10 bg-[rgba(20,20,19,0.4)] px-6 py-5 text-lg text-text-primary backdrop-blur-sm placeholder:text-text-muted focus:border-[color:var(--color-primary)] focus:bg-[rgba(20,20,19,0.6)] focus:shadow-[0_0_0_4px_rgba(196,114,79,0.1)] focus:outline-none transition-all duration-300"
                required
              />
            </div>
            <Button
              id="shorten-button"
              onClick={handleSubmit}
              className="shorten-button w-full rounded-2xl border-none bg-gradient-to-br from-[color:var(--color-primary)] to-[#c56647] px-5 py-6 font-ui text-lg font-semibold text-text-inverse shadow-[0_4px_20px_rgba(196,114,79,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] relative overflow-hidden group transform transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative z-10">Shorten URL</span>
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
            </Button>
          </div>
        )}
      </div>
    </TiltWrapper>
  );
}
