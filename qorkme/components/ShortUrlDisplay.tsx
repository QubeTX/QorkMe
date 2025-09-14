'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Copy, QrCode, ExternalLink, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import QRCode from 'qrcode';
import { cn } from '@/lib/utils';

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
    } catch (err) {
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
          dark: '#0A0A0A',
          light: '#FAFAFA',
        },
      });
      setQrCodeUrl(url);
      setShowQr(true);
    } catch (err) {
      toast.error('Failed to generate QR code');
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      {/* Success Message */}
      <div className="flex items-center gap-3 text-bauhaus-blue">
        <CheckCircle size={32} />
        <h2 className="font-display text-3xl uppercase">URL Successfully Shortened!</h2>
      </div>

      {/* Short URL Display */}
      <div className="bg-bauhaus-white border-4 border-bauhaus-black p-6 space-y-4">
        <div className="flex items-center gap-4">
          <input
            type="text"
            value={fullShortUrl}
            readOnly
            className="flex-1 px-4 py-3 bg-bauhaus-gray bg-opacity-10 text-lg font-mono select-all"
          />
          <Button
            variant={copied ? 'accent' : 'primary'}
            onClick={copyToClipboard}
            className="flex items-center gap-2"
          >
            {copied ? <CheckCircle size={20} /> : <Copy size={20} />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={generateQrCode} className="flex items-center gap-2">
            <QrCode size={20} />
            QR Code
          </Button>
          <a href={fullShortUrl} target="_blank" rel="noopener noreferrer" className="inline-flex">
            <Button variant="outline" className="flex items-center gap-2">
              <ExternalLink size={20} />
              Visit
            </Button>
          </a>
        </div>
      </div>

      {/* QR Code Display */}
      {showQr && qrCodeUrl && (
        <div className="bg-bauhaus-white border-4 border-bauhaus-black p-6 animate-float">
          <img src={qrCodeUrl} alt="QR Code" className="mx-auto" />
          <p className="text-center mt-4 text-bauhaus-gray">
            Scan this QR code to visit your shortened URL
          </p>
        </div>
      )}

      {/* Original URL Info */}
      <div className="space-y-2">
        <p className="text-bauhaus-gray">
          <span className="font-display uppercase">Original URL:</span>
        </p>
        <p className="text-sm break-all bg-bauhaus-gray bg-opacity-10 p-3">{longUrl}</p>
        {domain && (
          <p className="text-xs text-bauhaus-gray">
            Domain: {domain} • Created: {new Date(createdAt || Date.now()).toLocaleDateString()}
          </p>
        )}
      </div>
    </div>
  );
}
