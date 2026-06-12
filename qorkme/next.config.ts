import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // @chenglou/pretext ships raw .ts source — Next must transpile it
  transpilePackages: ['@chenglou/pretext'],
};

export default nextConfig;
