import { UrlShortener } from '@/components/UrlShortener';
import { GeometricDecor } from '@/components/bauhaus/GeometricDecor';
import { Toaster } from 'react-hot-toast';

export default function Home() {
  return (
    <>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: 'var(--bauhaus-white)',
            color: 'var(--bauhaus-black)',
            border: '3px solid var(--bauhaus-black)',
            fontFamily: 'var(--font-display)',
            textTransform: 'uppercase',
          },
        }}
      />

      <div className="relative min-h-screen bg-bauhaus-white overflow-hidden">
        {/* Geometric Background Decorations */}
        <GeometricDecor />

        {/* Main Content */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
          <main className="w-full max-w-4xl mx-auto space-y-12">
            {/* Header */}
            <div className="text-center space-y-4">
              {/* Geometric Logo */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-bauhaus-red rounded-full" />
                <div className="w-12 h-12 bg-bauhaus-blue rotate-45" />
                <div className="w-0 h-0 border-l-[24px] border-l-transparent border-r-[24px] border-r-transparent border-b-[42px] border-b-bauhaus-yellow" />
              </div>

              <h1 className="font-display text-7xl md:text-8xl uppercase tracking-wider">
                QORK.ME
              </h1>

              <p className="font-display text-2xl text-bauhaus-gray uppercase tracking-wide">
                Industrial-Strength URL Shortening
              </p>
            </div>

            {/* URL Shortener Form */}
            <UrlShortener />

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
              <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white">
                <div className="w-8 h-8 bg-bauhaus-blue mb-4" />
                <h3 className="font-display text-xl uppercase mb-2">Memorable</h3>
                <p className="text-sm text-bauhaus-gray">
                  Smart algorithm creates pronounceable, typable short codes
                </p>
              </div>

              <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white">
                <div className="w-8 h-8 bg-bauhaus-red rounded-full mb-4" />
                <h3 className="font-display text-xl uppercase mb-2">Scalable</h3>
                <p className="text-sm text-bauhaus-gray">
                  Designed to handle 200,000+ URLs with optimal performance
                </p>
              </div>

              <div className="border-4 border-bauhaus-black p-6 bg-bauhaus-white">
                <div className="w-0 h-0 border-l-[16px] border-l-transparent border-r-[16px] border-r-transparent border-b-[28px] border-b-bauhaus-yellow mb-4" />
                <h3 className="font-display text-xl uppercase mb-2">Analytics</h3>
                <p className="text-sm text-bauhaus-gray">
                  Track clicks, devices, and geographic data in real-time
                </p>
              </div>
            </div>
          </main>

          {/* Footer */}
          <footer className="mt-20 text-center text-bauhaus-gray">
            <p className="font-display text-sm uppercase tracking-wider">
              Designed for Geek Squad • Built with Bauhaus Principles
            </p>
          </footer>
        </div>
      </div>
    </>
  );
}
