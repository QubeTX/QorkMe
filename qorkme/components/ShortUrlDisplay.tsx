'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { Copy, QrCode, ExternalLink, CheckCircle, Link2, Calendar, Globe } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

interface ShortUrlDisplayProps {
  shortCode: string;
  longUrl: string;
  domain?: string;
  createdAt?: string;
}

export function ShortUrlDisplay({ shortCode, longUrl, domain, createdAt }: ShortUrlDisplayProps) {
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);

  const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${shortCode}`;
  const fullShortUrl = `https://${shortUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      setCopied(true);
      toast.success('Copied to clipboard!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Failed to copy');
    }
  };

  const generateQrCode = async () => {
    if (qrCodeUrl) {
      setShowQr(!showQr);
      return;
    }

    try {
      const url = await QRCode.toDataURL(fullShortUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#36454F',
          light: '#FDFBF7',
        },
      });
      setQrCodeUrl(url);
      setShowQr(true);
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <div className="w-full space-y-8">
      {/* Success Message */}
      <div
        className="flex items-start gap-5 rounded-[var(--radius-xl)] border border-[color:var(--color-primary)]/25 bg-[color:var(--color-primary)]/10 px-6 py-5 text-[color:var(--color-primary)] animate-fadeIn"
        role="status"
        aria-live="polite"
      >
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[color:var(--color-primary)]/20">
          <CheckCircle size={22} aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h2 className="font-display text-xl font-semibold text-[color:var(--color-text-primary)]">
            Link ready to share
          </h2>
          <p className="text-sm text-text-secondary">Copy, preview, or download a QR code below.</p>
        </div>
      </div>

      {/* Short URL Display Card */}
      <Card
        elevated
        hoverable={false}
        className="animate-fadeIn"
        style={{ animationDelay: '0.1s' }}
      >
        <CardHeader>
          <CardTitle>Your short link</CardTitle>
          <CardDescription>
            Share this branded redirect with your audience in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <Input
                type="text"
                value={fullShortUrl}
                readOnly
                aria-label="Shortened URL"
                className="flex-1 font-mono text-lg"
              />
              <Button
                variant={copied ? 'accent' : 'primary'}
                onClick={copyToClipboard}
                className="min-w-[120px] justify-center"
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} aria-hidden="true" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} aria-hidden="true" />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row">
              <Button variant="outline" size="sm" onClick={generateQrCode}>
                <QrCode size={18} aria-hidden="true" />
                {showQr ? 'Hide' : 'Show'} QR Code
              </Button>
              <a
                href={fullShortUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex"
              >
                <Button variant="outline" size="sm">
                  <ExternalLink size={18} aria-hidden="true" />
                  Visit link
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {showQr && qrCodeUrl && (
        <Card hoverable={false} className="animate-fadeIn">
          <CardContent className="space-y-6 py-10 text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-5" />
            <p className="text-text-secondary">Scan this QR code to visit your shortened URL</p>
          </CardContent>
        </Card>
      )}

      {/* Original URL Info */}
      <Card hoverable={false} className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <CardHeader className="space-y-3">
          <CardTitle className="text-xl">Link details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-5">
            <div className="flex items-start gap-4">
              <Link2 className="mt-1 text-text-muted" size={18} aria-hidden="true" />
              <div className="flex-1">
                <p className="mb-1 text-sm font-medium text-text-secondary">Original URL</p>
                <p className="break-all rounded-[var(--radius-md)] bg-[color:var(--color-surface-elevated)] px-4 py-2.5 font-mono text-sm text-text-muted">
                  {longUrl}
                </p>
              </div>
            </div>

            {domain && (
              <div className="flex items-center gap-4">
                <Globe className="text-text-muted" size={18} aria-hidden="true" />
                <div>
                  <p className="mb-1 text-sm font-medium text-text-secondary">Domain</p>
                  <p className="text-sm text-text-muted">{domain}</p>
                </div>
              </div>
            )}

            {createdAt && (
              <div className="flex items-center gap-4">
                <Calendar className="text-text-muted" size={18} aria-hidden="true" />
                <div>
                  <p className="mb-1 text-sm font-medium text-text-secondary">Created</p>
                  <p className="text-sm text-text-muted">
                    {new Date(createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
