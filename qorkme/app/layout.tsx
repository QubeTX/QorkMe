import type { Metadata } from 'next';
import './globals.css';
import { PretextProvider } from '@/lib/pretext/PretextProvider';
import { SmoothScroll } from '@/components/effects/SmoothScroll';
import CustomCursor from '@/components/effects/CustomCursor';
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* FOUC guard for the entrance choreography: hide [data-load] targets
            pre-paint; LoadSequence sets real transforms and lifts the
            attribute. 3s failsafe + no-JS never arms (server HTML = final
            state). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.setAttribute('data-loading','');setTimeout(function(){document.documentElement.removeAttribute('data-loading')},3000);`,
          }}
        />
      </head>
      <body>
        <PretextProvider>
          <SmoothScroll>
            <CustomCursor />
            {children}
          </SmoothScroll>
        </PretextProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
