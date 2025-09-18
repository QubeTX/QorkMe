'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { Link2, Zap, Settings2, Check } from 'lucide-react';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export function UrlShortener() {
  const [url, setUrl] = useState('');
  const [customAlias, setCustomAlias] = useState('');
  const [showCustom, setShowCustom] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

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
      <CardHeader className="space-y-3 text-left md:text-center">
        <CardTitle className="text-2xl md:text-3xl tracking-[0.2em] uppercase">
          Launch a new short link
        </CardTitle>
        <CardDescription className="text-base text-text-secondary">
          Paste the destination and tailor an optional alias. Our warm card surfaces keep every step
          grounded and legible.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Main URL Input */}
          <div className="space-y-3">
            <label
              htmlFor="url"
              className="block text-xs font-semibold text-text-muted uppercase tracking-[0.4em]"
            >
              Enter your URL
            </label>
            <div className="relative group">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your-very-long-url-here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="pr-12 text-base py-4 group-hover:border-accent transition-all duration-300"
                required
              />
              <Link2
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted group-hover:text-accent transition-colors"
                size={20}
              />
            </div>
          </div>

          {/* Custom Alias Section */}
          <div className="space-y-5">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center gap-3 text-text-secondary hover:text-accent transition-all duration-300 group p-3 rounded-[var(--radius-md)]"
              style={{
                backgroundColor: showCustom
                  ? 'color-mix(in srgb, var(--color-surface-muted) 65%, transparent)'
                  : 'color-mix(in srgb, var(--color-surface) 88%, transparent)',
              }}
            >
              <div
                className={`transition-all duration-300 ${showCustom ? 'rotate-90 text-accent' : 'group-hover:scale-110'}`}
              >
                <Settings2 size={20} />
              </div>
              <span className="font-semibold text-sm uppercase tracking-wide">
                Custom Alias (Optional)
              </span>
            </button>

            {showCustom && (
              <div
                className="animate-slideIn space-y-3 p-5 border rounded-[var(--radius-lg)]"
                style={{
                  borderColor: 'color-mix(in srgb, var(--color-border) 65%, transparent)',
                  backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
                }}
              >
                <label
                  htmlFor="alias"
                  className="block text-xs font-semibold text-text-muted uppercase tracking-[0.4em]"
                >
                  Choose your custom alias
                </label>
                <div className="flex gap-3 items-center">
                  <span className="text-text-muted font-mono text-sm font-semibold bg-border/20 px-3 py-2 rounded">
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
                    className="flex-1 font-mono py-3"
                    pattern="[a-z0-9-]+"
                    minLength={3}
                    maxLength={50}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={checkAliasAvailability}
                    disabled={!customAlias || loading}
                    className="px-4 py-3"
                  >
                    <Check size={16} />
                    Check
                  </Button>
                </div>
                <p className="text-xs text-text-muted font-medium">
                  Use lowercase letters, numbers, and hyphens. 3-50 characters.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="w-full py-4 text-lg font-bold transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-text-inverse border-t-transparent" />
                  <span>Creating your link...</span>
                </>
              ) : (
                <>
                  <Zap size={22} className="animate-pulse" />
                  <span>Shorten URL</span>
                </>
              )}
            </Button>
          </div>

          {/* Info Text */}
          <p className="text-xs text-center text-text-muted font-medium pt-2">
            By shortening a URL, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </CardContent>
    </>
  );
}
