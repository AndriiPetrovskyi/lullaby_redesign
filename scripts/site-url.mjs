// Single source for the public site URL used in canonical links, Open Graph
// tags, sitemap.xml and robots.txt. Shared by vite.config.js and the sitemap
// script so the two can never disagree.
import { loadEnv } from "vite";

const FALLBACK_SITE_URL = "https://andriipetrovskyi.github.io/lullaby_redesign";

export function resolveSiteUrl(mode = "production") {
  const { VITE_SITE_URL } = loadEnv(mode, process.cwd(), "VITE_");
  return (VITE_SITE_URL || FALLBACK_SITE_URL).replace(/\/+$/, "");
}
