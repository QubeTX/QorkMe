import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { ResultNavigationHeader } from '@/components/ResultNavigationHeader';
import { Card, CardContent } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { createServerClientInstance } from '@/lib/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Link2, BarChart3, Shield } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

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
            border: '2px solid var(--color-border)',
            borderRadius: 'var(--radius-md)',
            fontFamily: 'var(--font-body)',
          },
        }}
      />

      <div className="min-h-screen bg-background transition-colors duration-300">
        <ResultNavigationHeader />

        <section className="pt-36 pb-24 px-6">
          <div className="container mx-auto max-w-5xl space-y-14">
            <ShortUrlDisplay
              shortCode={url.short_code}
              longUrl={url.long_url}
              domain={new URL(url.long_url).hostname}
              createdAt={url.created_at}
            />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[{
                title: 'Total clicks',
                value: url.click_count || 0,
                icon: <BarChart3 size={20} className="text-accent" />,
                tint: 'var(--color-accent)',
              },
              {
                title: 'Alias type',
                value: url.custom_alias ? 'Custom' : 'Auto',
                icon: <Link2 size={20} className="text-secondary" />,
                tint: 'var(--color-secondary)',
              },
              {
                title: 'Status',
                value: url.is_active ? 'Active' : 'Inactive',
                icon: <Shield size={20} className="text-primary" />,
                tint: 'var(--color-primary)',
              }].map((stat) => (
                <Card
                  key={stat.title}
                  hoverable={false}
                  className="shadow-soft border"
                  style={{
                    borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                    backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
                  }}
                >
                  <CardContent className="p-6">
                    <div className="flex items-center gap-4">
                      <div
                        className="w-12 h-12 rounded-[var(--radius-md)] flex items-center justify-center"
                        style={{ background: `color-mix(in srgb, ${stat.tint} 18%, transparent)` }}
                      >
                        {stat.icon}
                      </div>
                      <div>
                        <p className="text-2xl font-display font-semibold text-secondary">
                          {stat.value}
                        </p>
                        <p className="text-xs uppercase tracking-[0.35em] text-text-muted">{stat.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card
              hoverable={false}
              className="text-center"
              style={{
                borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
              }}
            >
              <CardContent className="space-y-6 py-10">
                <h3 className="font-display text-2xl md:text-3xl text-secondary">
                  Need deeper analytics?
                </h3>
                <p className="text-text-secondary max-w-2xl mx-auto">
                  Unlock campaign tagging, multi-user collaboration, and full clickstream history inside the QorkMe dashboard.
                  The same warm design extends across desktop, tablet, and mobile.
                </p>
                <Link href="/">
                  <Button size="lg" className="px-8">
                    Shorten another URL
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </section>

        <footer
          className="border-t py-10"
          style={{ borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)' }}
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col md:flex-row md:items-center gap-3 text-center md:text-left">
                <span className="font-display text-lg font-semibold text-secondary tracking-[0.3em] uppercase">
                  QORKME
                </span>
                <span className="hidden md:inline text-text-muted">•</span>
                <span className="text-xs font-medium text-text-muted tracking-[0.35em] uppercase">
                  Precision link studio
                </span>
              </div>
              <p className="text-xs md:text-sm text-text-muted tracking-[0.25em] text-center md:text-right">
                Designed in San Francisco • Powered by Supabase & Vercel
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
