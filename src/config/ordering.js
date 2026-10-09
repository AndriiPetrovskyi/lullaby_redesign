// Sitewide order-pause switch. When true, the banner shows on every page and
// all "Buy now" / "Direct Order" actions are disabled. Flip back by changing
// VITE_ORDERING_PAUSED (no code change needed).
export const ORDERING_PAUSED = import.meta.env.VITE_ORDERING_PAUSED === "true";
