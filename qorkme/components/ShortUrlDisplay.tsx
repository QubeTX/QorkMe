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
      <div className="flex items-center gap-3 text-primary animate-fadeIn">
        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
          <CheckCircle size={24} />
        </div>
        <div>
          <h2 className="font-display text-2xl font-bold">Success!</h2>
          <p className="text-sm text-text-secondary">Your URL has been shortened</p>
        </div>
      </div>

      {/* Short URL Display Card */}
      <Card elevated className="animate-fadeIn" style={{ animationDelay: '0.1s' }}>
        <CardHeader>
          <CardTitle>Your Short URL</CardTitle>
          <CardDescription>Share this link anywhere</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={fullShortUrl}
                readOnly
                className="flex-1 px-4 py-3 bg-surface-elevated rounded-[var(--radius-md)] font-mono text-lg select-all border-2 border-border focus:border-primary focus:outline-none transition-colors"
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
            <div className="flex gap-3">
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
        <Card className="animate-fadeIn">
          <CardContent className="text-center py-8">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={qrCodeUrl} alt="QR Code" className="mx-auto mb-4" />
            <p className="text-text-secondary">Scan this QR code to visit your shortened URL</p>
          </CardContent>
        </Card>
      )}

      {/* Original URL Info */}
      <Card className="animate-fadeIn" style={{ animationDelay: '0.2s' }}>
        <CardHeader>
          <CardTitle className="text-lg">Link Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <Link2 className="text-text-muted mt-1" size={18} />
              <div className="flex-1">
                <p className="text-sm font-medium text-text-secondary mb-1">Original URL</p>
                <p className="text-sm break-all bg-surface-elevated p-3 rounded-[var(--radius-sm)] font-mono text-text-muted">
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
