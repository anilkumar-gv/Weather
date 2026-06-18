import type { NextConfig } from "next";

// Use BACKEND_URL in deployment to proxy frontend /api requests to the backend.
// NEXT_PUBLIC_BACKEND_URL is also supported for browser-side fetches if needed.
const backendUrl = process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

const nextConfig: NextConfig = {
  async rewrites() {
    if (!backendUrl) {
      return [];
    }

    return [
      {
        source: "/api/:path*",
        destination: `${backendUrl.replace(/\/$/, "")}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
