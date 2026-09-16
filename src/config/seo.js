// Canonical production target for all SEO metadata (sitemap, canonical
// links, Open Graph/Twitter URLs), independent of which host actually
// served the bundle a visitor is looking at.
export const SITE_URL = "https://andriipetrovskyi.github.io/lullaby_redesign";

export const SITE_NAME = "Lullaby";

export const DEFAULT_DESCRIPTION =
  "Hand-poured scented candles in hand-glazed ceramic vessels. Every Lullaby candle hides a packet of seeds inside — plant them when the candle is done and give the vessel a second life.";

// Falls back to a real product photo until the site has a dedicated share image.
export const DEFAULT_OG_IMAGE =
  "https://api-production-38d4.up.railway.app/uploads/8d001142-743b-4f2c-aee0-e126d7d0127d/light-pink-1.jpg";

export function absoluteUrl(path = "/") {
  const cleanPath = path.startsWith("/") ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}
