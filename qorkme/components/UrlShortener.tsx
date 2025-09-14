'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Link2, Zap, Settings2 } from 'lucide-react';
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
    <form onSubmit={handleSubmit} className="w-full max-w-2xl mx-auto space-y-6">
      {/* Main URL Input */}
      <div className="space-y-2">
        <div className="relative">
          <Input
            type="url"
            placeholder="Enter your long URL here..."
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            disabled={loading}
            className="pr-12 text-lg h-14 border-4"
            required
          />
          <Link2 className="absolute right-4 top-1/2 -translate-y-1/2 text-bauhaus-gray" />
        </div>
      </div>

      {/* Custom Alias Section */}
      <div className="space-y-4">
        <button
          type="button"
          onClick={() => setShowCustom(!showCustom)}
          className="flex items-center gap-2 text-bauhaus-gray hover:text-bauhaus-black transition-colors"
        >
          <Settings2 size={20} />
          <span className="font-display">Custom Alias (Optional)</span>
        </button>

        {showCustom && (
          <div className="flex gap-2 items-center animate-float">
            <span className="text-bauhaus-gray font-mono">qork.me/</span>
            <Input
              type="text"
              placeholder="your-custom-alias"
              value={customAlias}
              onChange={(e) =>
                setCustomAlias(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))
              }
              disabled={loading}
              className="flex-1"
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
              Check
            </Button>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={loading}
        className="w-full bauhaus-shape-square flex items-center justify-center gap-3"
      >
        {loading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
            <span>Creating...</span>
          </>
        ) : (
          <>
            <Zap size={24} />
            <span>Shorten URL</span>
          </>
        )}
      </Button>
    </form>
  );
}
