import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { ResultNavigationHeader } from '@/components/ResultNavigationHeader';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Toaster } from 'react-hot-toast';
import { SiteFooter } from '@/components/SiteFooter';

interface ResultPageProps {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ code?: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;
  // const { code } = await searchParams;

  // Fetch URL data from database
  const supabase = await createServerClientInstance();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data: url, error } = await (supabase as any)
    .from('urls')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !url) {
    notFound();
  }

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

      <div className="flex min-h-screen flex-col bg-background transition-colors duration-300">
        <ResultNavigationHeader />

        <main className="flex flex-1 flex-col">
          <section className="page-section pt-[calc(var(--section-spacing)+4rem)] md:pt-[calc(var(--section-spacing)+5rem)]">
            <div className="container mx-auto max-w-3xl flex flex-col gap-16">
              <ShortUrlDisplay shortCode={url.short_code} />

              <div className="flex flex-col items-center gap-4 text-center">
                <h3 className="font-display text-2xl text-text-primary">
                  Link shared. Mission accomplished.
                </h3>
                <p className="max-w-xl text-base text-text-secondary">
                  Keep the momentum rolling—when another idea pops up, QorkMe is here to give it a
                  clean, confident link.
                </p>
                <Link href="/" className="inline-flex">
                  <Button size="lg" className="justify-center px-8">
                    Make another short link
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <SiteFooter subtitle="Links that feel friendly and intentional" />
      </div>
    </>
  );
}
