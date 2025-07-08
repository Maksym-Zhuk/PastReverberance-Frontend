import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/graphql',
        destination: 'https://c6j1w7gd-8080.euw.devtunnels.ms/graphql',
      },
    ];
  },
};

export default nextConfig;
