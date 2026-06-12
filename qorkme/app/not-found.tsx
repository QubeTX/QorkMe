import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import DotGrid from '@/components/effects/DotGrid';
import MatrixDisplay from '@/components/effects/MatrixDisplay';
import { PretextBlock } from '@/lib/pretext/PretextBlock';

export default function NotFound() {
  return (
    <div
      className="font-makira relative flex min-h-screen flex-col overflow-hidden"
      style={{ background: 'var(--color-void)' }}
    >
      <DotGrid className="fixed inset-0 z-0" />

      <main className="relative z-10 flex flex-1 items-center justify-center">
        <div
          className="flex w-full flex-col items-center text-center"
          style={{
            maxWidth: '640px',
            paddingInline: 'var(--container-padding-x)',
            gap: 'var(--space-lg)',
          }}
        >
          <span className="mono-label">ERR_404 // ROUTE NOT FOUND</span>

          {/* LED 404 sweep */}
          <div style={{ width: '100%', height: 'clamp(64px, 14vw, 110px)' }}>
            <MatrixDisplay words={['404', 'NOT.FOUND']} className="h-full w-full" />
          </div>

          <h1 className="sr-only">404 — link not found</h1>
          <h2 style={{ fontSize: 'var(--text-h3)' }}>We couldn&apos;t find that link.</h2>

          <PretextBlock
            text="The short URL you're searching for may have expired, been removed, or never existed in the first place."
            lineHeight={1.6}
            as="p"
            className="text-sm text-[color:var(--color-text-secondary)]"
          >
            The short URL you&apos;re searching for may have expired, been removed, or never existed
            in the first place.
          </PretextBlock>

          <Link href="/" className="inline-flex">
            <Button size="lg">Qork a New Link</Button>
          </Link>
        </div>
      </main>
    </div>
  );
}
