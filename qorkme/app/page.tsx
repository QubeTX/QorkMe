import Link from 'next/link';
import Image from 'next/image';
import { UrlShortener } from '@/components/UrlShortener';
import { SiteFooter } from '@/components/SiteFooter';
import { MatrixDisplay } from '@/components/MatrixDisplay';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
import { AmbientDecor } from '@/components/ui/ambient-decor';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--color-surface)',
            color: 'var(--color-text-primary)',
            border: '1px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
            boxShadow: '0 12px 30px -18px rgba(38, 38, 35, 0.35)',
          },
        }}
      />

      <div
        id="page-wrapper"
        className="page-wrapper font-makira relative flex min-h-screen flex-col transition-colors duration-300 overflow-hidden"
      >
        {/* Interactive Grid Background (Bottom Layer) */}
        <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

        {/* Ambient Decor (Middle Layer - Floating Orbs) */}
        <AmbientDecor />

        <main
          id="main-content"
          className="main-content flex flex-1 items-center justify-center py-8 relative z-10 pointer-events-none"
        >
          <div
            id="content-container"
            className="content-container flex w-full max-w-[700px] flex-col gap-12"
            style={{ paddingLeft: '24px', paddingRight: '24px' }}
          >
            {/* Qork Logo */}
            <div className="flex justify-center pointer-events-auto">
              <Link href="/">
                <Image
                  src="/qork-logo.svg"
                  alt="Qork logo"
                  width={112}
                  height={112}
                  className="h-20 w-20 md:h-28 md:w-28 transition-opacity hover:opacity-70"
                  style={{ opacity: 0.85 }}
                />
              </Link>
            </div>

            {/* Matrix Display with Title and Clock */}
            <div id="matrix-display-wrapper" className="matrix-display-wrapper text-center">
              <MatrixDisplay />
            </div>

            {/* Main Card with URL Shortener */}
            <div
              id="url-shortener-wrapper"
              className="url-shortener-wrapper animate-fadeIn-delay-800 opacity-0 pointer-events-auto"
              style={{ marginLeft: '16px', marginRight: '16px' }}
            >
              <UrlShortener />
            </div>
          </div>
        </main>

        <SiteFooter showLogo={false} />
      </div>
    </>
  );
}
