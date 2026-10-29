import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  turbopack: {},
  experimental: {
    agentUpgrade: "security",
  },
};

export default nextConfig;
