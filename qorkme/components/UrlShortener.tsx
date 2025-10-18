'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import toast from 'react-hot-toast';

type CardState = 'input' | 'shortening' | 'shortened';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [cardState, setCardState] = useState<CardState>('input');
  const [shortenedUrl, setShortenedUrl] = useState('');
  const [copyButtonText, setCopyButtonText] = useState('Copy Link');
  const cardRef = useRef<HTMLDivElement>(null);

  // 3D Tilt effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cardState !== 'input') return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 80;
      const rotateY = (centerX - x) / 80;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-5px)`;
    };

    const handleMouseLeave = () => {
      if (card) {
        card.style.transform = '';
      }
    };

    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [cardState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    // Start loading
    setCardState('shortening');

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

      // Simulate a slight delay for animation smoothness
      await new Promise((resolve) => setTimeout(resolve, 800));

      const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${data.shortCode}`;
      setShortenedUrl(shortUrl);
      setCardState('shortened');
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');
      setCardState('input');
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shortenedUrl);
      setCopyButtonText('✓ Copied!');
      toast.success('Link copied to clipboard!');

      setTimeout(() => {
        setCopyButtonText('Copy Link');
      }, 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
      toast.error('Failed to copy link');
    }
  };

  const handleCreateNew = () => {
    setCardState('input');
    setUrl('');
    setShortenedUrl('');
    setCopyButtonText('Copy Link');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as unknown as React.FormEvent);
    }
  };

  return (
    <div
      ref={cardRef}
      className={`
        relative rounded-[30px]
        bg-[color:var(--color-surface)]/[0.03]
        shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.1),0_0_0_1px_rgba(255,255,255,0.05)]
        backdrop-blur-xl
        border border-white/10
        transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
        animate-fadeIn
        ${cardState === 'shortening' ? 'scale-[0.98]' : ''}
        ${cardState === 'shortened' ? 'bg-[color:var(--color-surface)]/[0.05]' : ''}
        hover:shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.15),0_0_0_1px_rgba(255,255,255,0.1)]
        hover:-translate-y-[5px]
      `}
      style={{
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Gradient border effect */}
      <div
        className={`
          absolute -inset-[2px] rounded-[30px]
          bg-gradient-to-br from-[color:var(--color-primary)] via-[color:var(--color-accent)] to-[color:var(--color-primary)]
          opacity-0 -z-10 transition-opacity duration-500
          ${cardState === 'shortened' ? 'opacity-10' : ''}
        `}
        aria-hidden="true"
      />

      {/* Input State */}
      <div
        className={`
          p-6 sm:p-8 md:p-12
          transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${cardState !== 'input' ? 'opacity-0 -translate-y-5 pointer-events-none absolute inset-0' : ''}
        `}
      >
        <label
          htmlFor="url-input"
          className="mb-6 block font-ui text-sm uppercase tracking-[0.2em] text-text-muted"
        >
          Enter Your URL
        </label>
        <div className="mb-6">
          <Input
            id="url-input"
            type="url"
            placeholder="https://example.com/your/very/long/url/here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            onKeyPress={handleKeyPress}
            className="w-full rounded-2xl border-2 border-white/10 bg-[rgba(20,20,19,0.4)] px-6 py-5 text-lg text-text-primary backdrop-blur-sm transition-all duration-300 placeholder:text-text-muted focus:border-[color:var(--color-primary)] focus:bg-[rgba(20,20,19,0.6)] focus:shadow-[0_0_0_4px_rgba(196,114,79,0.1)]"
            required
          />
        </div>
        <Button
          onClick={handleSubmit}
          className="group relative w-full overflow-hidden rounded-2xl border-none bg-gradient-to-br from-[color:var(--color-primary)] to-[#c56647] px-5 py-6 font-ui text-lg font-semibold text-text-inverse shadow-[0_4px_20px_rgba(196,114,79,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(196,114,79,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-0"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-500 group-hover:translate-x-full" />
          <span className="relative">Shorten URL</span>
        </Button>
      </div>

      {/* Loading State */}
      <div
        className={`
          p-6 sm:p-8 md:p-12
          flex items-center justify-center transition-all duration-500
          ${cardState !== 'shortening' ? 'opacity-0 pointer-events-none absolute inset-0' : ''}
        `}
      >
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[color:var(--color-primary)]/20 border-t-[color:var(--color-primary)]" />
          <p className="font-ui text-lg text-text-secondary">Creating your link...</p>
        </div>
      </div>

      {/* Output State */}
      <div
        className={`
          p-6 sm:p-8 md:p-12
          text-center transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]
          ${cardState !== 'shortened' ? 'opacity-0 pointer-events-none absolute inset-0' : 'animate-slideIn'}
        `}
      >
        <div className="mb-6 inline-block animate-[successPop_0.6s_cubic-bezier(0.4,0,0.2,1)]">
          <span className="text-6xl" role="img" aria-label="Success">
            ✨
          </span>
        </div>
        <div className="mb-4 font-ui text-sm uppercase tracking-[0.2em] text-text-muted">
          Your shortened URL
        </div>
        <div className="mb-6 rounded-2xl border-2 border-[color:var(--color-primary)]/30 bg-[rgba(20,20,19,0.4)] px-8 py-6 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:border-[color:var(--color-primary)] hover:bg-[rgba(20,20,19,0.6)]">
          <div className="break-all font-ui text-2xl font-semibold text-[color:var(--color-primary)] drop-shadow-[0_2px_10px_rgba(196,114,79,0.3)] md:text-3xl">
            {shortenedUrl}
          </div>
        </div>
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
          <Button
            onClick={handleCopy}
            className={`
              flex-1 rounded-2xl border-none px-4 py-5 font-ui text-base font-medium shadow-[0_4px_20px_rgba(106,155,204,0.3),inset_0_1px_0_rgba(255,255,255,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_8px_30px_rgba(106,155,204,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] active:translate-y-0
              ${copyButtonText === 'Copy Link' ? 'bg-gradient-to-br from-[#6a9bcc] to-[#5a8bbc] text-text-inverse' : 'bg-gradient-to-br from-[color:var(--color-accent)] to-[#4f6a49] text-text-inverse'}
            `}
          >
            {copyButtonText}
          </Button>
          <Button
            onClick={handleCreateNew}
            className="flex-1 rounded-2xl border-2 border-white/20 bg-white/10 px-4 py-5 font-ui text-base font-medium text-text-primary shadow-[inset_0_1px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-white/30 hover:bg-white/15 active:translate-y-0"
          >
            Shorten Another
          </Button>
        </div>
      </div>
    </div>
  );
}
