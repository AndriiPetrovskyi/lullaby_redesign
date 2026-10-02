// Runs before `vite build` (see package.json). Writes public/sitemap.xml and
// public/robots.txt, which Vite then copies into dist/ verbatim.
//
// Product URLs come from the live API at build time, so the sitemap always
// matches whatever's in the store — no manual upkeep when products change.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveSiteUrl } from "./site-url.mjs";

const SITE_URL = resolveSiteUrl();
const API_BASE_URL =
  process.env.VITE_API_BASE_URL ?? "https://api-production-38d4.up.railway.app/api";

const STATIC_PATHS = [
  "/",
  "/products",
  "/about",
  "/contact",
  "/terms",
  "/privacy-policy",
];

async function fetchProductPaths() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const products = await res.json();
    return products
      .filter((product) => product.is_active)
      .map((product) => `/products/${product.slug}`);
  } catch (error) {
    console.warn(
      "[sitemap] could not fetch products, writing static URLs only:",
      error.message,
    );
    return [];
  }
}

const paths = [...STATIC_PATHS, ...(await fetchProductPaths())];

const urlEntries = paths
  .map((p) => `  <url>\n    <loc>${SITE_URL}${p}</loc>\n  </url>`)
  .join("\n");

const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urlEntries}\n</urlset>\n`;

const outDir = path.resolve("public");
await mkdir(outDir, { recursive: true });
await writeFile(path.join(outDir, "sitemap.xml"), xml, "utf8");
await writeFile(
  path.join(outDir, "robots.txt"),
  `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`,
  "utf8",
);

console.log(
  `[sitemap] wrote ${paths.length} URLs to public/sitemap.xml (+ robots.txt) for ${SITE_URL}`,
);
