import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  outputFileTracingRoot: process.cwd(),
  devIndicators: false,
  // @chenglou/pretext ships raw .ts source — Next must transpile it
  transpilePackages: ['@chenglou/pretext'],
};

export default nextConfig;
