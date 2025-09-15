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

      <div className="min-h-screen bg-background transition-colors duration-300 flex flex-col">
        {/* Navigation Header */}
        <NavigationHeader />

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Hero Section */}
          <section className="flex-1 flex items-center justify-center px-6 py-24 min-h-[calc(100vh-80px)]">
            <div className="container mx-auto max-w-7xl w-full">
              <div className="text-center mb-20 animate-fadeIn space-y-6">
                <div className="inline-flex items-center gap-3 px-8 py-4 rounded-full bg-gradient-to-r from-secondary/10 to-accent/10 border border-secondary/20 backdrop-blur-sm">
                  <Sparkles size={20} className="text-secondary animate-pulse" />
                  <span className="text-sm font-display font-semibold tracking-widest text-secondary uppercase">
                    Premium URL Management
                  </span>
                </div>
                <h1 className="font-display font-bold text-gradient leading-tight py-4">
                  Shorten Links
                  <br />
                  <span className="text-secondary">Amplify Impact</span>
                </h1>
                <p className="text-xl md:text-2xl text-text-secondary max-w-3xl mx-auto leading-relaxed font-light px-4">
                  Transform your long URLs into memorable, trackable links with our sophisticated
                  URL shortener. Built for brands that demand elegance and performance.
                </p>
              </div>

              {/* URL Shortener Card */}
              <div className="max-w-4xl mx-auto">
                <Card
                  elevated
                  className="animate-fadeIn transform hover:scale-[1.02] transition-all duration-500"
                  style={{ animationDelay: '0.2s' }}
                >
                  <UrlShortener />
                </Card>
              </div>
            </div>
          </section>

          {/* Features Section */}
          <section className="py-24 px-6 bg-surface/50">
            <div className="container mx-auto max-w-7xl">
              <h2 className="text-center font-display text-3xl font-bold mb-16 text-secondary">
                Why Choose QorkMe?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
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
            </div>
          </section>

          {/* Statistics Section */}
          <section className="py-24 px-6">
            <div className="container mx-auto max-w-6xl">
              <Card className="border-2 border-primary/20 backdrop-blur-sm bg-surface/80">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-8 p-8 md:p-12">
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-secondary mb-3">200K+</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
                      URLs Shortened
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-accent mb-3">99.9%</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
                      Uptime SLA
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-primary mb-3">50ms</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
                      Response Time
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-4xl font-display font-bold text-secondary mb-3">15+</div>
                    <p className="text-sm font-medium text-text-muted uppercase tracking-wider">
                      Global Regions
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-24 px-6 bg-gradient-to-b from-transparent to-surface/50">
            <div className="container mx-auto max-w-4xl text-center">
              <h2 className="font-display text-3xl md:text-4xl font-bold mb-6 text-secondary uppercase tracking-wide">
                Ready to elevate your links?
              </h2>
              <p className="text-lg md:text-xl text-text-secondary mb-12 max-w-2xl mx-auto">
                Join elite brands who trust QorkMe for their premium URL management needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a href="#" className="inline-block">
                  <button className="btn bg-secondary text-text-inverse hover:bg-secondary-hover px-8 md:px-10 py-3 md:py-4 font-bold shadow-xl hover:shadow-2xl transition-all duration-300 border-2 border-secondary w-full sm:w-auto">
                    Start Shortening
                  </button>
                </a>
                <Link href="/docs" className="inline-block">
                  <button className="btn bg-transparent border-2 border-accent hover:border-secondary hover:bg-accent/10 text-accent hover:text-secondary px-8 md:px-10 py-3 md:py-4 font-bold transition-all duration-300 w-full sm:w-auto">
                    Documentation
                  </button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        {/* Footer */}
        <footer className="border-t-2 border-border py-12 bg-surface/80 backdrop-blur-sm">
          <div className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-bold text-secondary">QORKME</span>
                <span className="text-accent text-2xl">•</span>
                <span className="text-sm font-medium text-text-muted uppercase tracking-wider">
                  Premium URL Management
                </span>
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
