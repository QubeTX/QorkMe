import { UrlShortener } from '@/components/UrlShortener';
import { NavigationHeader } from '@/components/NavigationHeader';
import { FeatureCard } from '@/components/cards/FeatureCard';
import { Card } from '@/components/cards/Card';
import { Toaster } from 'react-hot-toast';
import { Zap, Shield, BarChart3, Link2, Sparkles, Globe } from 'lucide-react';
import Link from 'next/link';

export default function Home() {
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
        <NavigationHeader />

        {/* Hero Section */}
        <section className="pt-32 pb-20 px-6">
          <div className="container mx-auto max-w-7xl">
            <div className="text-center mb-16 animate-fadeIn">
              <div className="inline-flex items-center gap-3 px-6 py-3 rounded-sm bg-secondary/10 border border-secondary/20 mb-8">
                <Sparkles size={18} className="text-secondary" />
                <span className="text-sm font-display font-semibold tracking-wider text-secondary">Premium URL Management</span>
              </div>
              <h1 className="font-display font-bold mb-8 text-gradient leading-none">
                Shorten Links
                <br />
                <span className="text-secondary">Amplify Impact</span>
              </h1>
              <p className="text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light">
                Transform your long URLs into memorable, trackable links with our sophisticated URL
                shortener. Built for brands that demand elegance and performance.
              </p>
            </div>

            {/* URL Shortener Card */}
            <div className="max-w-4xl mx-auto mb-32">
              <Card
                elevated
                className="animate-fadeIn shadow-2xl"
                style={{ animationDelay: '0.2s' }}
              >
                <UrlShortener />
              </Card>
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
              <FeatureCard
                icon={<Zap size={24} />}
                title="Lightning Fast"
                description="Optimized for speed with edge deployment and intelligent caching for instant redirects."
              />
              <FeatureCard
                icon={<Shield size={24} />}
                title="Enterprise Secure"
                description="Built-in security features including SSL, rate limiting, and protection against malicious URLs."
              />
              <FeatureCard
                icon={<BarChart3 size={24} />}
                title="Rich Analytics"
                description="Track clicks, devices, locations, and referrers with our comprehensive analytics dashboard."
              />
              <FeatureCard
                icon={<Globe size={24} />}
                title="Global CDN"
                description="Distributed across multiple regions for low-latency access from anywhere in the world."
              />
              <FeatureCard
                icon={<Link2 size={24} />}
                title="Custom Aliases"
                description="Create memorable branded links with custom aliases that reflect your identity."
              />
              <FeatureCard
                icon={<Sparkles size={24} />}
                title="Smart Generation"
                description="AI-powered algorithm creates pronounceable, memorable short codes automatically."
              />
            </div>

            {/* Statistics Section */}
            <div className="mb-20">
              <Card className="border-2 border-primary/20">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 p-12">
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-secondary mb-3">200K+</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">URLs Shortened</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-accent mb-3">99.9%</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">Uptime SLA</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-primary mb-3">50ms</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">Response Time</p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-secondary mb-3">15+</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">Global Regions</p>
                  </div>
                </div>
              </Card>
            </div>

            {/* CTA Section */}
            <div className="text-center py-20">
              <h2 className="font-display text-4xl font-bold mb-6 text-secondary uppercase tracking-wide">
                Ready to elevate your links?
              </h2>
              <p className="text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Join elite brands who trust QorkMe for their premium URL management needs.
              </p>
              <div className="flex gap-6 justify-center">
                <a href="#top" className="inline-block">
                  <button className="btn bg-secondary text-text-inverse hover:bg-secondary-hover px-10 py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-secondary">
                    Start Shortening
                  </button>
                </a>
                <Link href="/docs" className="inline-block">
                  <button className="btn bg-transparent border-2 border-accent hover:border-secondary hover:bg-accent/10 text-accent hover:text-secondary px-10 py-4 font-bold transition-all duration-300">
                    Documentation
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t-2 border-border py-12 mt-24 bg-surface">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-secondary">QORKME</span>
                <span className="text-accent text-2xl">•</span>
                <span className="text-sm font-medium text-text-muted uppercase tracking-wider">Premium URL Management</span>
              </div>
              <p className="text-sm text-text-muted font-medium tracking-wide">
                Crafted with ZT Bros Oskon Typography • San Francisco, CA
              </p>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
