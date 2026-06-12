import { UrlShortener } from '@/components/UrlShortener';
import { SiteFooter } from '@/components/SiteFooter';
import DotGrid from '@/components/effects/DotGrid';
import LoadSequence from '@/components/effects/LoadSequence';
import MatrixDisplay from '@/components/effects/MatrixDisplay';
import MatrixClock from '@/components/effects/MatrixClock';

export default function Home() {
  return (
    <div className="font-makira relative flex min-h-screen flex-col overflow-hidden">
      {/* The dot field — listens on window, never blocks clicks */}
      <DotGrid className="fixed inset-0 z-0" />
      <LoadSequence />

      <main
        id="main-content"
        className="relative z-10 flex flex-1 items-center justify-center"
        style={{ padding: 'var(--space-xl) var(--container-padding-x)' }}
      >
        <div className="flex w-full flex-col" style={{ maxWidth: '720px', gap: 'var(--space-lg)' }}>
          {/* Eyebrow — decode on entrance */}
          <div data-load="eyebrow" className="flex justify-center">
            <span data-load-decode className="mono-label">
              URL Shortener // A QubeTX Property
            </span>
          </div>

          {/* LED wordmark — masked rise (canvas is aria-hidden; the sr-only
              h1 carries the page name) */}
          <h1 className="sr-only">Qork.Me — URL Shortener</h1>
          <div style={{ overflow: 'hidden' }}>
            <div data-load="hl" style={{ height: 'clamp(72px, 16vw, 132px)' }}>
              <MatrixDisplay words={['QORK.ME']} className="h-full w-full" />
            </div>
          </div>

          {/* Live LED clock — the terminal is honest */}
          <div data-load="desc" className="flex justify-center">
            <div className="hidden md:block" style={{ width: 'min(100%, 440px)', height: '44px' }}>
              <MatrixClock seconds className="h-full w-full" />
            </div>
            <div className="md:hidden" style={{ width: 'min(100%, 260px)', height: '36px' }}>
              <MatrixClock className="h-full w-full" />
            </div>
          </div>

          {/* The shortener card */}
          <div data-load="cta">
            <UrlShortener />
          </div>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
