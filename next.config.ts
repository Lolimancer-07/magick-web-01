import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      // WASM file — long cache, correct MIME
      {
        source: "/wasm/:path*",
        headers: [
          { key: "Content-Type", value: "application/wasm" },
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      // Worker JS — cache but allow revalidation
      {
        source: "/magick.worker.js",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400, stale-while-revalidate=604800" },
        ],
      },
      // Enable SharedArrayBuffer for future multi-thread WASM (requires COOP+COEP)
      {
        source: "/:path*",
        headers: [
          { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
          { key: "Cross-Origin-Embedder-Policy", value: "require-corp" },
        ],
      },
    ];
  },
  // Turbopack config (Next.js 16 default bundler)
  turbopack: {},
};

export default nextConfig;
