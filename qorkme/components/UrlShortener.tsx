'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { Link2, Zap, Settings2, Check, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const urlHelpId = 'url-help-text';
  const aliasSectionId = 'custom-alias-section';
  const aliasHelpId = 'alias-help-text';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!url.trim()) {
      toast.error('Please enter a URL');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/shorten', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url,
          customAlias: showCustom ? customAlias : null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to shorten URL');
      }

      // Navigate to result page
      router.push(`/result/${data.id}?code=${data.shortCode}`);
    } catch (error) {
      console.error('Error shortening URL:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to shorten URL');
    } finally {
      setLoading(false);
    }
  };

  const checkAliasAvailability = async () => {
    if (!customAlias.trim()) return;

    try {
      const response = await fetch(`/api/shorten?alias=${encodeURIComponent(customAlias)}`);
      const data = await response.json();

      if (data.available) {
        toast.success('This alias is available!');
      } else {
        toast.error(data.error || 'This alias is not available');
      }
    } catch (error) {
      console.error('Error checking alias:', error);
    }
  };

  return (
    <>
      <CardHeader className="gap-4 text-left">
        <CardTitle className="text-2xl md:text-3xl">Create a short link</CardTitle>
        <CardDescription className="text-base text-text-secondary">
          Paste a destination URL and optionally layer on a custom alias. Every field is spaced for
          clarity and ready for keyboard or touch input.
        </CardDescription>
      </CardHeader>
      <CardContent className="gap-0 pt-0">
        <form onSubmit={handleSubmit} className="flex flex-col gap-8">
          {/* Main URL Input */}
          <div className="space-y-3">
            <label htmlFor="url" className="block text-sm font-semibold text-text-secondary">
              Destination URL
            </label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your-very-long-url-here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="pr-12 text-base"
                aria-describedby={urlHelpId}
                required
              />
              <Link2
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                size={20}
                aria-hidden="true"
              />
            </div>
            <p id={urlHelpId} className="text-xs text-text-muted">
              We support http(s) URLs and trackable query strings.
            </p>
          </div>

          {/* Custom Alias Section */}
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              aria-expanded={showCustom}
              aria-controls={aliasSectionId}
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-lg)] border border-border/55 bg-[color:var(--color-surface-elevated)]/90 px-6 py-4 text-left shadow-soft transition-all duration-200 hover:-translate-y-[1px] hover:border-[color:var(--color-primary)]/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[color:var(--color-ring)] focus-visible:ring-offset-2 focus-visible:ring-offset-[color:var(--color-surface)]"
            >
              <span className="flex items-center gap-3 text-base font-semibold text-text-primary">
                <Settings2 size={20} aria-hidden="true" />
                Add a custom alias (optional)
              </span>
              <ChevronDown
                size={18}
                aria-hidden="true"
                className={`transition-transform duration-200 ${showCustom ? 'rotate-180' : ''}`}
              />
            </button>

            {showCustom && (
              <div
                id={aliasSectionId}
                role="region"
                aria-label="Custom alias options"
                className="animate-slideIn space-y-5 rounded-[var(--radius-xl)] border border-border/55 bg-[color:var(--color-surface)]/95 p-6 shadow-[0_18px_48px_-28px_rgba(47,42,38,0.38)] focus-within:border-[color:var(--color-primary)]/65 focus-within:shadow-[0_0_0_4px_color-mix(in srgb, var(--color-primary) 30%, transparent)]"
              >
                <label htmlFor="alias" className="block text-sm font-semibold text-text-secondary">
                  Custom alias
                </label>
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
                  <span className="inline-flex h-12 items-center rounded-[var(--radius-lg)] bg-[color:var(--color-surface-elevated)] px-5 font-mono text-sm text-text-muted">
                    qork.me/
                  </span>
                  <Input
                    id="alias"
                    type="text"
                    placeholder="your-custom-alias"
                    value={customAlias}
                    onChange={(e) =>
                      setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
                    }
                    disabled={loading}
                    className="flex-1 h-12 font-mono"
                    pattern="[a-z0-9-]+"
                    minLength={3}
                    maxLength={50}
                    aria-describedby={aliasHelpId}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="md"
                    onClick={checkAliasAvailability}
                    disabled={!customAlias || loading}
                    className="h-12 whitespace-nowrap px-5"
                  >
                    <Check size={16} aria-hidden="true" />
                    Check
                  </Button>
                </div>
                <p id={aliasHelpId} className="text-xs text-text-muted">
                  Use lowercase letters, numbers, and hyphens. 3-50 characters.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-3">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full justify-center"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-[color:var(--color-text-inverse)] border-t-transparent" />
                  <span>Creating your link...</span>
                </>
              ) : (
                <>
                  <Zap
                    size={20}
                    className="text-[color:var(--color-text-inverse)]"
                    aria-hidden="true"
                  />
                  <span>Shorten URL</span>
                </>
              )}
            </Button>
          </div>

          {/* Info Text */}
          <p className="pt-3 text-center text-xs text-text-muted">
            By shortening a URL, you agree to our Terms of Service and Privacy Policy.
          </p>
        </form>
      </CardContent>
    </>
  );
}
