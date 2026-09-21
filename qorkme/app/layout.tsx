import type { Metadata, Viewport } from 'next';
import './globals.css';
import { PretextProvider } from '@/lib/pretext/PretextProvider';
import { MotionPreference } from '@/components/brand/MotionPreference';
import { DitherTrail } from '@/components/brand/DitherTrail';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'QorkMe - Modern URL Shortener',
  description: 'A clean, modern URL shortener with friendly sharing and custom aliases',
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.svg', type: 'image/svg+xml' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
};

export const viewport: Viewport = { themeColor: '#f6f4ef' };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <PretextProvider>
          <MotionPreference>
            <a className="skip-link" href="#main-content">
              Skip to content
            </a>
            {children}
            <DitherTrail />
          </MotionPreference>
        </PretextProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
