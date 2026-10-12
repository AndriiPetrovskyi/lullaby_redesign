// Sitewide order-pause switch. When true, the banner shows on every page and
// all "Buy now" / "Direct Order" actions are disabled. Flip back by changing
// VITE_ORDERING_PAUSED (no code change needed).
export const ORDERING_PAUSED = import.meta.env.VITE_ORDERING_PAUSED === "true";

// When true, "Buy now" opens the site's own checkout (paid via WesternBid)
// instead of sending buyers to Etsy. Turn on once WesternBid is live.
export const CHECKOUT_ENABLED = import.meta.env.VITE_CHECKOUT_ENABLED === "true";
