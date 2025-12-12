import type { NextConfig } from "next";
const API_HOST = process.env.API_HOST || 'http://localhost:3001';

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  env: {
    NEXT_PUBLIC_API_HOST: API_HOST,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "www.melivecode.com",
      },
    ],
  },
};

export default nextConfig;
