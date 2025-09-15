import { ShortUrlDisplay } from '@/components/ShortUrlDisplay';
import { ResultNavigationHeader } from '@/components/ResultNavigationHeader';
import { Card, CardContent } from '@/components/cards/Card';
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
        {/* Navigation Header */}
        <ResultNavigationHeader />

        {/* Main Content */}
        <section className="pt-32 pb-16 px-6">
          <div className="container mx-auto max-w-4xl">
            {/* Result Display */}
            <ShortUrlDisplay
              shortCode={url.short_code}
              longUrl={url.long_url}
              domain={new URL(url.long_url).hostname}
              createdAt={url.created_at}
            />

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <BarChart3 className="text-primary" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-text-primary">
                        {url.click_count || 0}
                      </p>
                      <p className="text-sm text-text-muted">Total Clicks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center">
                      <Link2 className="text-secondary" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-text-primary">
                        {url.custom_alias ? 'Custom' : 'Auto'}
                      </p>
                      <p className="text-sm text-text-muted">Alias Type</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-accent/10 flex items-center justify-center">
                      <Shield className="text-accent" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-display font-bold text-text-primary">
                        {url.is_active ? 'Active' : 'Inactive'}
                      </p>
                      <p className="text-sm text-text-muted">Status</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center mt-16">
              <h3 className="font-display text-2xl font-bold mb-4 text-text-primary">
                Need more features?
              </h3>
              <p className="text-text-secondary mb-6">
                Track analytics, manage multiple links, and more with our dashboard
              </p>
              <Link href="/">
                <button className="btn bg-primary text-text-inverse hover:bg-primary-hover px-6 py-2.5 rounded-[var(--radius-md)] font-medium shadow-medium hover:shadow-large transition-all duration-200">
                  Shorten Another URL
                </button>
              </Link>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-border py-8 mt-16">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <span className="font-display text-lg font-medium text-text-primary">QorkMe</span>
                <span className="text-text-muted">•</span>
                <span className="text-sm text-text-muted">Modern URL Shortener</span>
              </div>
              <p className="text-sm text-text-muted">
                Built with ZT Bros Typography • Designed in San Francisco
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
