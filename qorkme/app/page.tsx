import { UrlShortener } from '@/components/UrlShortener';
import { NavigationHeader } from '@/components/NavigationHeader';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { Card } from '@/components/cards/Card';
import { Button } from '@/components/ui/Button';
import { Toaster } from 'react-hot-toast';
import { ArrowUpRight, BarChart3, Globe, Link2, Shield, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
  const stats = [
    { value: '200K+', label: 'URLs curated', accentClass: 'text-accent' },
    { value: '15+', label: 'Global regions', accentClass: 'text-secondary' },
    { value: '50ms', label: 'Average redirect', accentClass: 'text-primary' },
    { value: '24/7', label: 'Monitoring', accentClass: 'text-secondary' },
  ];

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

      <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
        <NavigationHeader />

        <main className="flex-1 flex flex-col pt-32 md:pt-36">
          <section className="relative px-6 pb-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid gap-12 xl:grid-cols-[1.05fr_0.95fr] items-start">
                <div className="space-y-10 animate-fadeIn" style={{ animationDelay: '0.05s' }}>
                  <div
                    className="inline-flex items-center gap-3 px-6 py-3 rounded-full border bg-surface text-secondary shadow-soft backdrop-blur-sm"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--color-border) 65%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--color-surface) 85%, transparent)',
                    }}
                  >
                    <Sparkles size={18} className="text-accent animate-pulse" />
                    <span className="text-xs md:text-sm font-display font-semibold tracking-[0.4em] uppercase">
                      Premium url studio
                    </span>
                  </div>
                  <div className="space-y-6">
                    <h1 className="font-display text-4xl md:text-5xl xl:text-6xl leading-tight">
                      Precision-crafted links for brands that refuse ordinary
                    </h1>
                    <p className="text-base md:text-lg lg:text-xl text-text-secondary max-w-2xl">
                      QorkMe wraps powerful analytics, enterprise security, and human-friendly codes into a warm, earthy
                      experience that feels as considered as your brand. Shorten, share, and measure without sacrificing style.
                    </p>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4">
                    <Link href="#shorten" className="inline-flex">
                      <Button size="lg" className="w-full sm:w-auto">
                        Start shortening
                        <ArrowUpRight size={20} />
                      </Button>
                    </Link>
                    <Link href="/docs" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        Explore docs
                      </Button>
                    </Link>
                  </div>

                  <div className="grid gap-4 sm:grid-cols-2">
                    <Card
                      hoverable={false}
                      className="shadow-soft border bg-surface"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                        backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            background: 'color-mix(in srgb, var(--color-accent) 18%, transparent)',
                          }}
                        >
                          <BarChart3 size={22} className="text-accent" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-semibold text-secondary">200K+</p>
                          <p className="text-sm text-text-muted uppercase tracking-[0.3em]">Active Links</p>
                        </div>
                      </div>
                    </Card>
                    <Card
                      hoverable={false}
                      className="shadow-soft border bg-surface"
                      style={{
                        borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                        backgroundColor: 'color-mix(in srgb, var(--color-surface) 90%, transparent)',
                      }}
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full flex items-center justify-center"
                          style={{
                            background: 'color-mix(in srgb, var(--color-secondary) 18%, transparent)',
                          }}
                        >
                          <Shield size={22} className="text-secondary" />
                        </div>
                        <div>
                          <p className="text-2xl font-display font-semibold text-secondary">99.9%</p>
                          <p className="text-sm text-text-muted uppercase tracking-[0.3em]">Uptime SLA</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </div>

                <div className="relative" id="shorten">
                  <div
                    className="absolute -top-12 -right-12 h-44 w-44 rounded-full blur-3xl opacity-60"
                    style={{ background: 'color-mix(in srgb, var(--color-accent) 35%, transparent)' }}
                  />
                  <Card elevated className="relative animate-fadeIn" style={{ animationDelay: '0.15s' }}>
                    <UrlShortener />
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="container mx-auto max-w-7xl space-y-12">
              <Card hoverable={false} className="text-center mx-auto max-w-4xl">
                <div className="space-y-4">
                  <h2 className="font-display text-3xl md:text-4xl text-secondary">
                    Why discerning teams choose QorkMe
                  </h2>
                  <p className="text-base md:text-lg text-text-secondary max-w-2xl mx-auto">
                    Every touchpoint is thoughtfully spaced, responsive, and consistent. Cards anchor each experience with a
                    tactile warmth that carries across light and dark themes alike.
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 xl:gap-8">
                <FeatureCard
                  icon={<Zap size={24} />}
                  title="Lightning Fast"
                  description="Edge deployments and adaptive caching deliver millisecond redirects no matter where your audience clicks."
                />
                <FeatureCard
                  icon={<Shield size={24} />}
                  title="Enterprise Secure"
                  description="Layered safeguards, from rate limiting to malicious URL scrubbing, protect every branded touchpoint."
                />
                <FeatureCard
                  icon={<BarChart3 size={24} />}
                  title="Rich Analytics"
                  description="Understand engagement with geographic, device, and referral insights presented in elegant detail."
                />
                <FeatureCard
                  icon={<Globe size={24} />}
                  title="Global Reach"
                  description="Multi-region infrastructure keeps experiences cohesive, stable, and lightning quick across the globe."
                />
                <FeatureCard
                  icon={<Link2 size={24} />}
                  title="Custom Aliases"
                  description="Craft pronounceable, on-brand short codes with precise validation and collision prevention."
                />
                <FeatureCard
                  icon={<Sparkles size={24} />}
                  title="Guided Creation"
                  description="A refined flow guides teams from paste to share with subtle animations and accessible microcopy."
                />
              </div>
            </div>
          </section>

          <section className="px-6 pb-24">
            <div className="container mx-auto max-w-7xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
                {stats.map((stat) => (
                  <Card
                    key={stat.label}
                    hoverable={false}
                    className="text-center"
                    style={{
                      borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)',
                      backgroundColor: 'color-mix(in srgb, var(--color-surface) 92%, transparent)',
                    }}
                  >
                    <div className="space-y-3">
                      <span className={`text-3xl font-display font-semibold ${stat.accentClass}`}>
                        {stat.value}
                      </span>
                      <p className="text-xs uppercase tracking-[0.35em] text-text-muted">{stat.label}</p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </section>

          <section className="px-6 pb-28">
            <div className="container mx-auto max-w-5xl">
              <Card hoverable={false} className="text-center">
                <div className="space-y-6">
                  <h2 className="font-display text-3xl md:text-4xl text-secondary">
                    Ready to elevate every link?
                  </h2>
                  <p className="text-base md:text-lg text-text-secondary max-w-3xl mx-auto">
                    From campaign launches to enterprise migrations, QorkMe keeps your audience journeys considered, cohesive,
                    and measurable. Switch the theme, resize the browser—every detail adapts with grace.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link href="#shorten" className="inline-flex">
                      <Button size="lg" className="w-full sm:w-auto">
                        Create a short link
                        <ArrowUpRight size={20} />
                      </Button>
                    </Link>
                    <Link href="/docs" className="inline-flex">
                      <Button variant="outline" size="lg" className="w-full sm:w-auto">
                        View documentation
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>

        <footer
          className="border-t py-12"
          style={{ borderColor: 'color-mix(in srgb, var(--color-border) 70%, transparent)' }}
        >
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex flex-col md:flex-row md:items-center gap-3 text-center md:text-left">
                <span className="font-display text-2xl font-bold tracking-[0.35em] text-secondary uppercase">
                  QORKME
                </span>
                <span className="hidden md:inline text-text-muted">•</span>
                <span className="text-sm font-medium text-text-muted uppercase tracking-[0.35em]">
                  Crafted for memorable journeys
                </span>
              </div>
              <p className="text-sm text-text-muted font-medium tracking-[0.25em] text-center md:text-right">
                Thoughtfully designed in San Francisco • Powered by Supabase & Vercel
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
