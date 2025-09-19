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
      <CardHeader className="space-y-4 text-left">
        <CardTitle className="text-2xl md:text-3xl">Create a short link</CardTitle>
        <CardDescription className="text-base text-text-secondary">
          Paste a destination URL and optionally layer on a custom alias. Every field is spaced for
          clarity and ready for keyboard or touch input.
        </CardDescription>
      </CardHeader>
      <CardContent className="pt-0">
        <form onSubmit={handleSubmit} className="space-y-10">
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
              <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted" size={20} aria-hidden="true" />
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
              className="flex w-full items-center justify-between gap-3 rounded-[var(--radius-md)] border border-border bg-[color:var(--color-surface-elevated)]/65 px-5 py-3.5 text-left transition-colors hover:border-border-strong"
            >
              <span className="flex items-center gap-3 text-sm font-semibold text-text-primary">
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
                className="animate-slideIn space-y-4 rounded-[var(--radius-lg)] border border-border bg-[color:var(--color-surface)] p-6 shadow-soft"
              >
                <label htmlFor="alias" className="block text-sm font-semibold text-text-secondary">
                  Custom alias
                </label>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  <span className="inline-flex items-center rounded-[var(--radius-md)] bg-[color:var(--color-surface-elevated)] px-4 py-2.5 font-mono text-sm text-text-muted">
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
                    className="flex-1 font-mono"
                    pattern="[a-z0-9-]+"
                    minLength={3}
                    maxLength={50}
                    aria-describedby={aliasHelpId}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={checkAliasAvailability}
                    disabled={!customAlias || loading}
                    className="whitespace-nowrap"
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
                  <Zap size={20} className="text-[color:var(--color-text-inverse)]" aria-hidden="true" />
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
