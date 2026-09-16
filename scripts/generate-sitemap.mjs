// Runs before `vite build` (see package.json). Writes public/sitemap.xml,
// which Vite then copies into dist/ verbatim like any other public asset.
//
// Product URLs come from the live API at build time, so the sitemap always
// matches whatever's in the store — no manual upkeep when products change.
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

// Sitemap URLs always target the canonical GH Pages deployment (see
// src/config/seo.js), regardless of which host actually runs this build.
const SITE_URL = "https://andriipetrovskyi.github.io/lullaby_redesign";
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

console.log(`[sitemap] wrote ${paths.length} URLs to public/sitemap.xml`);
