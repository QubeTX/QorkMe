'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { QrCode, ExternalLink } from 'lucide-react';
import { useSlotRoll } from '@/lib/motion/SlotRoll';
import QRCode from 'qrcode';
import Image from 'next/image';

interface ShortUrlDisplayProps {
  shortCode: string;
}

/** Same-length mask so the arrival roll animates every glyph. */
function maskOf(text: string): string {
  return text.replace(/[^./:]/g, '·');
}

function ArrivalUrl({ text }: { text: string }) {
  const [mask] = useState(() => maskOf(text));
  const [ref, handle] = useSlotRoll(mask, { direction: 'up' });

  useEffect(() => {
    handle.set(text);
  }, [text, handle]);

  return (
    <span
      ref={ref}
      className="font-mono break-all text-[color:var(--color-text-primary)]"
      style={{ fontSize: 'clamp(1rem, 2.5vw, 1.35rem)', fontWeight: 600 }}
    >
      {mask}
    </span>
  );
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
    <Card elevated hoverable={false} className="w-full">
      <CardHeader>
        <CardTitle>Your short link</CardTitle>
        <CardDescription>
          Copy, share, or save it — your fresh redirect is ready whenever inspiration hits.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-6">
          <div
            className="flex flex-col gap-4 sm:flex-row sm:items-center"
            style={{
              background: '#070a14',
              border: '1px solid var(--color-border)',
              borderRadius: '6px',
              padding: '16px',
            }}
          >
            <div className="flex-1">
              <ArrivalUrl text={shortUrl} />
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
              className="inline-flex"
            >
              <Button variant="outline" size="sm">
                <ExternalLink size={18} aria-hidden="true" />
                Visit link
                <span className="sr-only"> (opens in a new tab)</span>
              </Button>
            </a>
          </div>

          {qrError && (
            <p role="alert" className="font-mono text-xs text-[color:var(--color-error)]">
              ERR // QR generation failed
            </p>
          )}

          {showQr && qrCodeUrl && (
            <div
              className="flex flex-col items-center gap-4 p-6 text-center"
              style={{
                border: '1px solid var(--color-border)',
                borderRadius: '6px',
                background: '#070a14',
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
                SCAN // SHARE OFFLINE
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
