import { UrlShortener } from '@/components/UrlShortener';
import { NavigationHeader } from '@/components/NavigationHeader';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { Card } from '@/components/cards/Card';
import { MetricCard } from '@/components/cards/MetricCard';
import { Button } from '@/components/ui/Button';
import { Toaster } from 'react-hot-toast';
import { ArrowUpRight, BarChart3, Globe, Link2, Shield, Smile, Sparkles, Zap } from 'lucide-react';
import Link from 'next/link';
import { SiteFooter } from '@/components/SiteFooter';

export default function Home() {
  const stats = [
    { value: '200K+', label: 'URLs curated', accent: 'primary' as const },
    { value: '15+', label: 'Global regions', accent: 'accent' as const },
    { value: '50ms', label: 'Average redirect', accent: 'secondary' as const },
    { value: '24/7', label: 'Monitoring', accent: 'primary' as const },
  ];

  const heroHighlights = [
    {
      title: 'Active links',
      value: '200K+',
      icon: <BarChart3 size={20} aria-hidden="true" />,
      accent: 'primary' as const,
    },
    {
      title: 'Uptime',
      value: '99.9%',
      icon: <Shield size={20} aria-hidden="true" />,
      accent: 'secondary' as const,
    },
  ];

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
        <NavigationHeader />

        <main className="flex flex-1 flex-col">
          <section
            id="hero"
            className="page-section pt-[calc(var(--section-spacing)+4rem)] md:pt-[calc(var(--section-spacing)+5rem)] lg:pt-[calc(var(--section-spacing)+6rem)]"
          >
            <div className="container">
              <div className="grid gap-y-16 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-x-16">
                <div className="flex flex-col gap-12">
                  <span className="inline-flex w-fit items-center gap-2 rounded-full border border-border/60 bg-[color:var(--color-background-accent)]/65 px-5 py-2.5 text-sm font-semibold uppercase tracking-[0.18em] text-[color:var(--color-secondary)]">
                    <Sparkles size={18} aria-hidden="true" />
                    Share-ready link studio
                  </span>
                  <div className="flex flex-col gap-6">
                    <h1 className="font-display text-[clamp(2.75rem,5vw+1.25rem,4.5rem)] font-semibold leading-[1.08] text-text-primary">
                      Precision short links for teams that move quickly
                    </h1>
                    <p className="max-w-2xl text-lg leading-relaxed text-text-secondary">
                      QorkMe keeps link sharing warm and welcoming—no dashboards, no detours. Paste
                      a URL, pick a vibe, and ship it with confidence in seconds.
                    </p>
                  </div>

                  <div className="flex flex-col gap-4 sm:flex-row">
                    <Link href="#shorten" className="inline-flex">
                      <Button size="lg" className="w-full sm:w-auto">
                        Start shortening
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                    {heroHighlights.map((highlight) => (
                      <MetricCard
                        key={highlight.title}
                        icon={highlight.icon}
                        value={highlight.value}
                        label={highlight.title}
                        accent={highlight.accent}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative" id="shorten">
                  <div
                    className="absolute inset-0 rounded-[var(--radius-xl)] bg-[color:var(--color-primary)]/12 blur-2xl"
                    aria-hidden="true"
                  />
                  <Card elevated className="relative mx-auto w-full max-w-xl">
                    <UrlShortener />
                  </Card>
                </div>
              </div>
            </div>
          </section>

          <section id="features" className="page-section">
            <div className="container flex flex-col gap-16">
              <Card hoverable={false} className="mx-auto max-w-4xl text-center">
                <div className="flex flex-col gap-5">
                  <h2 className="font-display text-3xl md:text-4xl text-text-primary">
                    Why discerning teams choose QorkMe
                  </h2>
                  <p className="mx-auto max-w-2xl text-base md:text-lg text-text-secondary">
                    Shared components, measured spacing, and accessible interactions carry across
                    the entire experience. Cards, buttons, and inputs stay consistent so the
                    interface stays calm from the homepage to the final copy click.
                  </p>
                </div>
              </Card>

              <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3">
                <FeatureCard
                  icon={<Zap size={24} aria-hidden="true" />}
                  title="Lightning fast"
                  description="Edge deployments and adaptive caching deliver millisecond redirects no matter where your audience clicks."
                />
                <FeatureCard
                  icon={<Shield size={24} aria-hidden="true" />}
                  title="Safe by default"
                  description="Layered safeguards, from rate limiting to malicious URL scrubbing, keep every redirect clean and trustworthy."
                />
                <FeatureCard
                  icon={<Smile size={24} aria-hidden="true" />}
                  title="Human centered"
                  description="No logins or dashboards—just a friendly flow that helps people share ideas without losing momentum."
                />
                <FeatureCard
                  icon={<Globe size={24} aria-hidden="true" />}
                  title="Global reach"
                  description="Multi-region infrastructure keeps experiences cohesive, stable, and quick across the globe."
                />
                <FeatureCard
                  icon={<Link2 size={24} aria-hidden="true" />}
                  title="Custom aliases"
                  description="Craft pronounceable, on-brand short codes with precise validation and collision prevention."
                />
                <FeatureCard
                  icon={<Sparkles size={24} aria-hidden="true" />}
                  title="Guided creation"
                  description="A refined flow guides teams from paste to share with subtle animations, helper text, and keyboard-friendly controls."
                />
              </div>
            </div>
          </section>

          <section id="insights" className="page-section">
            <div className="container">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
                {stats.map((stat) => (
                  <MetricCard
                    key={stat.label}
                    value={stat.value}
                    label={stat.label}
                    accent={stat.accent}
                    layout="vertical"
                  />
                ))}
              </div>
            </div>
          </section>

          <section id="cta" className="page-section">
            <div className="container max-w-4xl">
              <Card hoverable={false} className="text-center">
                <div className="flex flex-col gap-6">
                  <h2 className="font-display text-3xl md:text-4xl text-text-primary">
                    Ready to elevate every link?
                  </h2>
                  <p className="mx-auto max-w-3xl text-base md:text-lg text-text-secondary">
                    From college fundraisers to product drops, QorkMe keeps every handoff relaxed
                    and reliable. Switch the theme, resize the browser—every detail stays balanced
                    and reassuring.
                  </p>
                  <div className="flex flex-col justify-center gap-4 sm:flex-row">
                    <Link href="#shorten" className="inline-flex">
                      <Button size="lg" className="w-full px-8 sm:w-auto">
                        Create a short link
                        <ArrowUpRight size={20} aria-hidden="true" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        </main>

        <SiteFooter />
      </div>
    </>
  );
}
