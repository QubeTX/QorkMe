import Link from 'next/link';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Card, CardContent } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text-primary">
      <NavigationHeader />

      <main className="flex flex-1 flex-col">
        <section className="page-section flex flex-1 items-center pt-[calc(var(--section-spacing)+4rem)]">
          <div className="container relative flex flex-col items-center justify-center">
            <div className="absolute inset-x-0 top-0 mx-auto h-60 max-w-4xl rounded-full bg-[color:var(--color-primary)]/12 blur-3xl" />

            <Card hoverable={false} className="relative w-full max-w-3xl text-center">
              <CardContent className="gap-8 py-14">
                <div className="flex flex-col items-center gap-4">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[color:var(--color-primary)]/12 text-[color:var(--color-primary)]">
                    <Compass size={28} aria-hidden="true" />
                  </div>
                  <span className="text-sm font-semibold text-text-muted">Error 404</span>
                </div>
                <h1 className="font-display text-4xl leading-tight md:text-5xl font-semibold text-text-primary">
                  We couldn&apos;t find that link
                </h1>
                <p className="mx-auto max-w-2xl text-base md:text-lg text-text-secondary">
                  The short URL you&apos;re searching for may have expired, been removed, or never
                  existed. Let&apos;s guide you back to the QorkMe studio to craft something new.
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/" className="inline-flex">
                    <Button size="lg" className="w-full sm:w-auto">
                      Return home
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>
    </div>
  );
}
