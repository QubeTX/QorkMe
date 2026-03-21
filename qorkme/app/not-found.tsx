import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { InteractiveGridPattern } from '@/components/ui/interactive-grid-pattern';

export default function NotFound() {
  return (
    <div className="font-makira relative flex min-h-screen flex-col bg-background text-text-primary overflow-hidden">
      {/* Interactive Grid Background */}
      <InteractiveGridPattern className="absolute inset-0 z-0" width={40} height={40} />

      <div className="relative z-10 flex min-h-screen flex-col items-center justify-center pointer-events-none">
        <main>
          <div className="container relative flex flex-col items-center justify-center">
            <Card
              hoverable={false}
              className="relative w-full max-w-3xl text-center pointer-events-auto"
            >
              <CardContent className="gap-8 py-14">
                <div className="flex flex-col items-center gap-4">
                  <Link href="/">
                    <Image
                      src="/qork-logo.svg"
                      alt="Qork logo — return home"
                      width={64}
                      height={64}
                      className="h-16 w-16 transition-opacity hover:opacity-70"
                      style={{ opacity: 0.85 }}
                    />
                  </Link>
                  <span className="text-sm font-semibold text-text-muted">Error 404</span>
                </div>
                <h1 className="font-display text-4xl leading-tight md:text-5xl font-semibold text-text-primary">
                  We couldn&apos;t find that link.
                </h1>
                <p className="mx-auto max-w-2xl text-base md:text-lg text-text-secondary">
                  The short URL you&apos;re searching for may have expired, been removed, or never
                  existed in the first place :/
                </p>
                <div className="flex flex-col justify-center gap-3 sm:flex-row">
                  <Link href="/" className="inline-flex">
                    <Button size="lg" className="w-full sm:w-auto">
                      Qork a New Link
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </div>
  );
}
