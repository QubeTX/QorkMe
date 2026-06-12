import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { PageHeader } from '@/components/PageHeader';
import { SiteFooter } from '@/components/SiteFooter';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { PretextBlock } from '@/lib/pretext/PretextBlock';

interface ResultPageProps {
  params: Promise<{ id: string }>;
}

export default async function ResultPage({ params }: ResultPageProps) {
  const { id } = await params;

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
    <div
      className="font-makira flex min-h-screen flex-col"
      style={{ background: 'var(--color-void)' }}
    >
      <PageHeader right={<span>LINK READY</span>} />

      <main className="flex flex-1 flex-col" style={{ paddingTop: '120px' }}>
        <section style={{ paddingBottom: 'var(--section-spacing)' }}>
          <div
            className="mx-auto flex w-full flex-col"
            style={{
              maxWidth: '768px',
              paddingInline: 'var(--container-padding-x)',
              gap: 'var(--space-xl)',
            }}
          >
            <ShortUrlDisplay shortCode={url.short_code} />

            <div className="flex flex-col items-center gap-4 text-center">
              <h2 style={{ fontSize: 'var(--text-h3)' }}>Link shared. Mission accomplished.</h2>
              <PretextBlock
                text="Keep the momentum rolling — when another idea pops up, QorkMe is here to give it a clean, confident link."
                lineHeight={1.6}
                as="p"
                className="max-w-xl text-sm text-[color:var(--color-text-secondary)]"
              >
                Keep the momentum rolling — when another idea pops up, QorkMe is here to give it a
                clean, confident link.
              </PretextBlock>
              <Link href="/" className="inline-flex">
                <Button size="lg" className="justify-center px-8">
                  Make another short link
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SiteFooter />
    </div>
  );
}
