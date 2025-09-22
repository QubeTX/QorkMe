'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { Copy, QrCode, ExternalLink, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';

interface ShortUrlDisplayProps {
  shortCode: string;
}

export function ShortUrlDisplay({ shortCode }: ShortUrlDisplayProps) {
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
          dark: '#262623',
          light: '#faf9f5',
        },
      });
      setQrCodeUrl(url);
      setShowQr(true);
    } catch {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <Card elevated hoverable={false} className="w-full animate-fadeIn">
      <CardHeader>
        <CardTitle>Your short link</CardTitle>
        <CardDescription>
          Copy, share, or save it—your fresh redirect is ready whenever inspiration hits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
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

          <p className="text-sm text-text-secondary">
            Keep this tab open or drop the link into your favorite planner—QorkMe remembers so you
            can focus on the message.
          </p>

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

          {showQr && qrCodeUrl && (
            <div className="flex flex-col items-center gap-4 rounded-[var(--radius-lg)] border border-border/60 bg-[color:var(--color-background-accent)]/40 p-6 text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrCodeUrl} alt="QR Code" className="h-36 w-36" />
              <p className="text-xs text-text-muted">
                Scan or download to share offline moments just as fast.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
