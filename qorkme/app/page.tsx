import { UrlShortener } from '@/components/UrlShortener';
import { SiteFooter } from '@/components/SiteFooter';
import { MatrixDisplay } from '@/components/MatrixDisplay';
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

      <div className="relative flex min-h-screen flex-col transition-colors duration-300">
        <main className="flex flex-1 items-center justify-center overflow-hidden">
          <div className="container relative z-10 w-full max-w-[700px] px-8 py-8">
            {/* Matrix Display with Title and Clock */}
            <div className="animate-fadeIn text-center">
              <MatrixDisplay />
              <p className="mt-4 text-lg text-text-secondary md:text-xl">
                Smart URL shortening, beautifully simple
              </p>
            </div>

            {/* Main Card with URL Shortener */}
            <div className="mt-12">
              <UrlShortener />
            </div>
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
