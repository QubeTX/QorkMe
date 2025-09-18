import Link from 'next/link';
import { NavigationHeader } from '@/components/NavigationHeader';
import { Card, CardContent } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-background text-text-primary">
      <NavigationHeader />

      <div className="relative flex flex-col items-center justify-center min-h-screen px-6 py-24">
        <div
          className="absolute inset-x-0 top-24 mx-auto h-64 max-w-5xl rounded-full blur-3xl opacity-50"
          style={{ background: 'color-mix(in srgb, var(--color-accent) 22%, transparent)' }}
        />

        <Card
          hoverable={false}
          className="relative max-w-3xl w-full text-center"
          style={{
            borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
            backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
          }}
        >
          <CardContent className="space-y-8 py-14">
            <div className="flex flex-col items-center gap-4">
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center"
                style={{ background: 'color-mix(in srgb, var(--color-secondary) 18%, transparent)' }}
              >
                <Compass size={36} className="text-secondary" />
              </div>
              <span className="text-xs uppercase tracking-[0.5em] text-text-muted">404</span>
            </div>
            <h1 className="font-display text-4xl md:text-5xl text-secondary leading-tight">
              We couldn&apos;t locate that link
            </h1>
            <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
              The short URL you&apos;re searching for may have expired, been removed, or never existed. Let&apos;s guide you back to
              the QorkMe studio to craft something new.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/" className="inline-flex">
                <Button size="lg">Return home</Button>
              </Link>
              <Link href="/docs" className="inline-flex">
                <Button variant="outline" size="lg">
                  View documentation
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
