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
      <CardHeader>
        <CardTitle className="text-2xl">Shorten Your URL</CardTitle>
        <CardDescription>
          Paste your long URL below and we&apos;ll create a short, memorable link for you
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Main URL Input */}
          <div className="space-y-2">
            <label htmlFor="url" className="block text-sm font-medium text-text-secondary">
              Enter your URL
            </label>
            <div className="relative">
              <Input
                id="url"
                type="url"
                placeholder="https://example.com/your-very-long-url-here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={loading}
                className="pr-12"
                required
              />
              <Link2
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                size={20}
              />
            </div>
          </div>

          {/* Custom Alias Section */}
          <div className="space-y-4">
            <button
              type="button"
              onClick={() => setShowCustom(!showCustom)}
              className="flex items-center gap-2 text-text-secondary hover:text-primary transition-colors group"
            >
              <div className={`transition-transform duration-200 ${showCustom ? 'rotate-90' : ''}`}>
                <Settings2 size={18} />
              </div>
              <span className="font-medium text-sm">Custom Alias (Optional)</span>
            </button>

            {showCustom && (
              <div className="animate-slideIn space-y-2">
                <label htmlFor="alias" className="block text-sm font-medium text-text-secondary">
                  Choose your custom alias
                </label>
                <div className="flex gap-2 items-center">
                  <span className="text-text-muted font-mono text-sm">qork.me/</span>
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
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={checkAliasAvailability}
                    disabled={!customAlias || loading}
                  >
                    <Check size={16} />
                    Check
                  </Button>
                </div>
                <p className="text-xs text-text-muted">
                  Use lowercase letters, numbers, and hyphens. 3-50 characters.
                </p>
              </div>
            )}
          </div>

          {/* Submit Button */}
          <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
            {loading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-text-inverse border-t-transparent" />
                <span>Creating your link...</span>
              </>
            ) : (
              <>
                <Zap size={20} />
                <span>Shorten URL</span>
              </>
            )}
          </Button>

          {/* Info Text */}
          <p className="text-xs text-center text-text-muted">
            By shortening a URL, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </CardContent>
    </>
  );
}
