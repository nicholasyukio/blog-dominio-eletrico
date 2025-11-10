import type { NextConfig } from "next";

const nextConfig = {
  eslint: {
    // ⚠️ Warning: this allows production builds to succeed even with ESLint errors
    ignoreDuringBuilds: true,
  },
};
export default nextConfig;
