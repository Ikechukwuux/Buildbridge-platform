import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Fix for "Blocked cross-origin request to Next.js dev resource"
  allowedDevOrigins: ['127.0.0.1', 'localhost', '::1'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'buildbridge.ng', // adding production domain just in case
      }
    ],
  },
};

export default nextConfig;
