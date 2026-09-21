'use client';
import { BrandStage } from '@/components/brand/BrandStage';
import { SiteFooter } from '@/components/SiteFooter';

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-dvh flex-col">
      <main id="main-content" className="page-content" style={{ maxWidth: 760 }}>
        <BrandStage compact />
        <div className="message-panel">
          <h1>Let’s try that again.</h1>
          <p>This page could not load. Your existing links are still saved.</p>
          <button type="button" className="btn bg-primary text-white" onClick={reset}>
            Try again →
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
