// The site keeps its env variable names (VITE_* in .env.production and in the
// Vercel dashboard), so moving off Vite needs no change there: `env` hands
// them to the browser code, which reads process.env.VITE_*.
const SITE_URL = (process.env.VITE_SITE_URL || "https://lullaby-rituals.com").replace(/\/+$/, "");

/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    VITE_API_BASE_URL: process.env.VITE_API_BASE_URL,
    VITE_SITE_URL: SITE_URL,
    VITE_META_PIXEL_ID: process.env.VITE_META_PIXEL_ID,
    VITE_GA_MEASUREMENT_ID: process.env.VITE_GA_MEASUREMENT_ID,
    VITE_ORDERING_PAUSED: process.env.VITE_ORDERING_PAUSED,
    VITE_CHECKOUT_ENABLED: process.env.VITE_CHECKOUT_ENABLED,
    // Set by Vercel: "production" or "preview". Analytics stay off on previews.
    VITE_VERCEL_ENV: process.env.VERCEL_ENV,
  },
  // Local runs only: with DEV_API_PROXY=http://localhost:3000/api and
  // VITE_API_BASE_URL=/api, the browser calls /api on this server and the
  // backend gets the request from this machine, so it treats it as local
  // (every payment method, no rate limits). Unset on Vercel.
  async rewrites() {
    const target = process.env.DEV_API_PROXY;
    return target ? [{ source: "/api/:path*", destination: `${target}/:path*` }] : [];
  },
  devIndicators: false,
  // No AGENTS.md written by `next dev`: CLAUDE.md is the project's notes.
  agentRules: false,
  // The dev server opened from a phone on the same Wi-Fi.
  allowedDevOrigins: ["192.168.*.*"],
};

export default nextConfig;
