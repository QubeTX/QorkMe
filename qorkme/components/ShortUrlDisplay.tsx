'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { QrCode, ExternalLink } from 'lucide-react';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import QRCode from 'qrcode';
import Image from 'next/image';

interface ShortUrlDisplayProps {
  shortCode: string;
}

export function ShortUrlDisplay({ shortCode }: ShortUrlDisplayProps) {
  const [qrCodeUrl, setQrCodeUrl] = useState<string | null>(null);
  const [showQr, setShowQr] = useState(false);
  const [qrError, setQrError] = useState(false);

  const [copyRef, copyLabel] = useSlotRoll('COPY');

  const shortUrl = `${process.env.NEXT_PUBLIC_SHORT_DOMAIN || 'qork.me'}/${shortCode}`;
  const fullShortUrl = `https://${shortUrl}`;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(fullShortUrl);
      copyLabel.flash('COPIED');
    } catch {
      copyLabel.flash('FAILED');
    }
  };

  const generateQrCode = async () => {
    if (qrCodeUrl) {
      setShowQr(!showQr);
      return;
    }

    try {
      // Void modules on white — maximum scanner contrast
      const url = await QRCode.toDataURL(fullShortUrl, {
        width: 300,
        margin: 2,
        color: {
          dark: '#05070f',
          light: '#ffffff',
        },
      });
      setQrCodeUrl(url);
      setShowQr(true);
      setQrError(false);
    } catch {
      setQrError(true);
    }
  };

  return (
    <Card
      hoverable={false}
      className="w-full"
      style={{ borderRadius: 12, background: 'var(--color-surface)' }}
    >
      <CardHeader>
        <h1 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.025em' }}>Your short link</h1>
        <CardDescription>Copy your link or make a QR code to share it.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{
              background: 'var(--color-surface)',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div className="min-w-0 flex-1">
              <span
                className="font-mono"
                style={{ overflowWrap: 'anywhere', fontSize: 16, fontWeight: 500 }}
              >
                {shortUrl}
              </span>
            </div>
            <Button
              variant="outline"
              onClick={copyToClipboard}
              className="min-w-[110px] justify-center"
              aria-label="Copy short link to clipboard"
            >
              <span ref={copyRef}>COPY</span>
            </Button>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button variant="outline" size="sm" onClick={generateQrCode}>
              <QrCode size={18} aria-hidden="true" />
              {showQr ? 'Hide' : 'Show'} QR Code
            </Button>
            <a
              href={fullShortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn bg-transparent text-primary"
            >
              <ExternalLink size={18} aria-hidden="true" />
              Visit link
              <span className="sr-only"> (opens in a new tab)</span>
            </a>
          </div>

          {qrError && (
            <p role="alert" className="font-mono text-xs text-[color:var(--color-error)]">
              QR generation failed. Please try again.
            </p>
          )}

          {showQr && qrCodeUrl && (
            <div
              className="flex flex-col items-center gap-4 p-6 text-center"
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                background: 'var(--color-surface)',
              }}
            >
              <Image
                src={qrCodeUrl}
                alt={`QR code for ${shortUrl}`}
                className="h-36 w-36"
                width={144}
                height={144}
                unoptimized
                style={{ borderRadius: '4px' }}
              />
              <p className="font-mono text-xs text-[color:var(--color-text-dim)]">
                Scan to open the link
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
