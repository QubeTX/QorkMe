'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
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
    <div className="w-full space-y-6">
      {/* Success Message */}
      <div className="flex items-center gap-3 text-secondary animate-fadeIn">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{ background: 'color-mix(in srgb, var(--color-secondary) 18%, transparent)' }}
        >
          <CheckCircle size={24} className="text-secondary" />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold text-secondary tracking-[0.25em] uppercase">
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
        style={{
          animationDelay: '0.1s',
          borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
        }}
      >
        <CardHeader>
          <CardTitle className="tracking-[0.2em] uppercase text-secondary">Your short link</CardTitle>
          <CardDescription className="text-text-secondary">
            Share this beautiful, trackable link with your audience in seconds.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fullShortUrl}
                readOnly
                className="flex-1 px-4 py-3 rounded-[var(--radius-md)] font-mono text-lg select-all border-2 focus:outline-none transition-colors"
                style={{
                  backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 100%, transparent)',
                  borderColor: 'color-mix(in srgb, var(--color-border) 65%, transparent)',
                }}
              />
              <Button
                variant={copied ? 'accent' : 'primary'}
                onClick={copyToClipboard}
                className="min-w-[100px]"
              >
                {copied ? (
                  <>
                    <CheckCircle size={18} />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy size={18} />
                    Copy
                  </>
                )}
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm" onClick={generateQrCode}>
                <QrCode size={18} />
                {showQr ? 'Hide' : 'Show'} QR Code
              </Button>
              <a href={fullShortUrl} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="sm">
                  <ExternalLink size={18} />
                  Visit Link
                </Button>
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Display */}
      {showQr && qrCodeUrl && (
        <Card
          hoverable={false}
          className="animate-fadeIn"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-border) 65%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
          }}
        >
          <CardContent className="text-center py-8 space-y-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
            <p className="text-text-secondary">Scan this QR code to visit your shortened URL</p>
          </CardContent>
        </Card>
      )}

      {/* Original URL Info */}
      <Card
        hoverable={false}
        className="animate-fadeIn"
        style={{
          animationDelay: '0.2s',
          borderColor: 'color-mix(in srgb, var(--color-border) 65%, transparent)',
          backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
        }}
      >
        <CardHeader className="space-y-2">
          <CardTitle className="text-lg tracking-[0.2em] uppercase text-secondary">Link details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Link2 className="text-text-muted mt-1" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Original URL</p>
                <p
                  className="text-sm break-all p-3 rounded-[var(--radius-sm)] font-mono text-text-muted"
                  style={{
                    backgroundColor: 'color-mix(in srgb, var(--color-surface-elevated) 96%, transparent)',
                  }}
                >
                  {longUrl}
                </p>
              </div>
            </div>

            {domain && (
              <div className="flex items-center gap-3">
                <Globe className="text-text-muted" size={18} />
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Domain</p>
                  <p className="text-sm text-text-muted">{domain}</p>
                </div>
              </div>
            )}

            {createdAt && (
              <div className="flex items-center gap-3">
                <Calendar className="text-text-muted" size={18} />
                <div>
                  <p className="text-sm font-medium text-text-secondary mb-1">Created</p>
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
