// Meta Pixel ID — set via env so local dev never fires real events and the
// ID is easy to rotate without touching code. Public-ish value (visible in
// every page's network requests once live), unlike the Conversions API
// access token, which stays server-side only (backend .env, never here).
export const META_PIXEL_ID = import.meta.env.VITE_META_PIXEL_ID;

// Tracking only runs in production builds with a configured pixel ID — keeps
// `npm run dev` and any build missing the ID from sending real events.
export const isTrackingEnabled = Boolean(META_PIXEL_ID) && import.meta.env.PROD;

// Google Analytics 4 — same rules as the pixel: public ID from env, and only
// production builds with an ID configured send anything.
export const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
export const isGaEnabled = Boolean(GA_MEASUREMENT_ID) && import.meta.env.PROD;
