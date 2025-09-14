import Link from 'next/link';
import { GeometricDecor } from '@/components/bauhaus/GeometricDecor';
import { Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-bauhaus-white overflow-hidden">
      {/* Geometric Background Decorations */}
      <GeometricDecor />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-8">
        <main className="text-center space-y-8">
          {/* 404 Display with Bauhaus Shapes */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <div className="relative">
              <div className="w-24 h-24 bg-bauhaus-red rounded-full flex items-center justify-center">
                <span className="font-display text-4xl text-bauhaus-white">4</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-24 h-24 bg-bauhaus-blue rotate-45 flex items-center justify-center">
                <span className="font-display text-4xl text-bauhaus-white -rotate-45">0</span>
              </div>
            </div>
            <div className="relative">
              <div className="w-0 h-0 border-l-[48px] border-l-transparent border-r-[48px] border-r-transparent border-b-[84px] border-b-bauhaus-yellow flex items-end justify-center">
                <span className="font-display text-4xl text-bauhaus-black absolute bottom-4">
                  4
                </span>
              </div>
            </div>
          </div>

          <h1 className="font-display text-5xl md:text-6xl uppercase tracking-wider">
            Page Not Found
          </h1>

          <p className="font-body text-lg text-bauhaus-gray max-w-md mx-auto">
            The short URL you&apos;re looking for doesn&apos;t exist or has expired.
          </p>

          <Link
            href="/"
            className="inline-flex items-center gap-3 px-8 py-4 bg-bauhaus-blue text-bauhaus-white bauhaus-border font-display uppercase tracking-wider hover:scale-105 transition-transform"
          >
            <Home size={24} />
            <span>Return Home</span>
          </Link>
        </main>
      </div>
    </div>
  );
}
