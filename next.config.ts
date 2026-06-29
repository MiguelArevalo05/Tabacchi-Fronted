import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com'
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '4000',
        pathname: '/uploads/**'
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '4000',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'tabacchi-backend.onrender.com',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'tabacchi-backend.onrender.com',
        pathname: '/uploads/**'
      }
    ]
  }
};

export default nextConfig;
