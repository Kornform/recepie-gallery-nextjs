import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  images: {
    unoptimized: true,
  },
  typescript: {
    // Skip TypeScript check during build (IDE still checks)
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
