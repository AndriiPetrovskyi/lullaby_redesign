// Meta Pixel ID — set via env so local dev never fires real events and the
// ID is easy to rotate without touching code. Public-ish value (visible in
// every page's network requests once live), unlike the Conversions API
// access token, which stays server-side only (backend .env, never here).
export const META_PIXEL_ID = process.env.VITE_META_PIXEL_ID;

// A production build opened on this machine or the local network
// (`npm run preview`, a test build, a phone on the same Wi-Fi) must not
// count as a real visit either — only the deployed site sends events.
const LOCAL_HOSTNAME =
  /^(localhost|0\.0\.0\.0|127\.\d+\.\d+\.\d+|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$|\.local$/;
const isLocalHost =
  typeof window !== "undefined" && LOCAL_HOSTNAME.test(window.location.hostname);

// Vercel previews of a branch aren't real visits either. VERCEL_ENV is
// "preview" there, "production" on the live site, unset in local builds.
const isVercelPreview = process.env.VITE_VERCEL_ENV === "preview";
const isRealSite = process.env.NODE_ENV === "production" && !isLocalHost && !isVercelPreview;

// Tracking only runs in production builds with a configured pixel ID, on the
// live site — keeps `npm run dev`, local builds, Vercel previews and any
// build missing the ID from sending real events.
export const isTrackingEnabled = Boolean(META_PIXEL_ID) && isRealSite;

// Google Analytics 4 — same rules as the pixel: public ID from env, and only
// production builds on the deployed site send anything.
export const GA_MEASUREMENT_ID = process.env.VITE_GA_MEASUREMENT_ID;
export const isGaEnabled = Boolean(GA_MEASUREMENT_ID) && isRealSite;
