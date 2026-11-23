import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
  // @chenglou/pretext ships raw .ts source — Next must transpile it
  transpilePackages: ['@chenglou/pretext'],
  async rewrites() {
    return [{ source: '/install', destination: '/install/index.html' }];
  },
  async headers() {
    return [
      {
        source: '/install/:path*.:ext(md|mdx)',
        headers: [{ key: 'Content-Type', value: 'text/markdown; charset=utf-8' }],
      },
    ];
  },
};

export default nextConfig;
