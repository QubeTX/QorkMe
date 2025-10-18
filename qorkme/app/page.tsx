import { UrlShortener } from '@/components/UrlShortener';
import { SiteFooter } from '@/components/SiteFooter';
import { MatrixBackground } from '@/components/MatrixBackground';
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

      <MatrixBackground />

      <div className="relative flex min-h-screen flex-col bg-transparent transition-colors duration-300">
        <main className="flex flex-1 items-center justify-center overflow-hidden">
          <div className="container relative z-10 w-full max-w-[700px] px-8 py-8">
            {/* Logo */}
            <div className="mb-12 animate-fadeIn text-center">
              <h1 className="font-display text-[clamp(2.5rem,5vw+1.25rem,3.5rem)] font-bold leading-none tracking-tight text-text-primary drop-shadow-[0_4px_20px_rgba(196,114,79,0.3)]">
                Qork<span className="text-[color:var(--color-primary)]">Me</span>
              </h1>
              <p className="mt-4 text-lg text-text-secondary md:text-xl">
                Smart URL shortening, beautifully simple
              </p>
            </div>

            {/* Main Card with URL Shortener */}
            <UrlShortener />
          </div>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
