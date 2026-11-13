import type { NextConfig } from 'next';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080';

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
<<<<<<< Updated upstream
        source: '/graphql',
        destination: process.env.NEXT_PUBLIC_API_URL!,
=======
        source: '/api/:path*',
        destination: `${API_URL}/:path*`,
>>>>>>> Stashed changes
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

export default nextConfig;
