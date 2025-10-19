import { UrlShortener } from '@/components/UrlShortener';
import { SiteFooter } from '@/components/SiteFooter';
import { MatrixDisplay } from '@/components/MatrixDisplay';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';
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
        className="page-wrapper relative flex min-h-screen flex-col transition-colors duration-300"
      >
        {/* Interactive Grid Background */}
        <InteractiveGridPattern
          className="absolute inset-0 z-0"
          width={40}
          height={40}
          squares={[20, 20]}
        />

        <main
          id="main-content"
          className="main-content flex flex-1 items-center justify-center overflow-hidden py-8"
        >
          <div
            id="content-container"
            className="content-container relative z-10 flex w-full max-w-[700px] flex-col gap-12 px-4"
          >
            {/* Matrix Display with Title and Clock */}
            <div
              id="matrix-display-wrapper"
              className="matrix-display-wrapper animate-fadeIn text-center"
            >
              <MatrixDisplay />
            </div>

            {/* Main Card with URL Shortener */}
            <div id="url-shortener-wrapper" className="url-shortener-wrapper">
              <UrlShortener />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
