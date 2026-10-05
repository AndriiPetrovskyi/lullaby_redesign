// Runs after `vite build` (see package.json). Writes a copy of dist/index.html
// per route — dist/products/<slug>/index.html etc. — with that page's own
// <title>, description, canonical and Open Graph tags filled in.
//
// Why: link-preview bots (Facebook, Messenger, Telegram, WhatsApp) don't run
// JavaScript, so they only ever saw the home page's tags — every shared
// product link previewed as the generic home page. Static hosts serve these
// files before the SPA rewrite, and once JS runs, React Helmet takes over as
// before. Static page titles/descriptions mirror each page's <Seo> props.
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { resolveSiteUrl } from "./site-url.mjs";

const SITE_URL = resolveSiteUrl();
const SITE_NAME = "Lullaby";
const API_BASE_URL =
  process.env.VITE_API_BASE_URL ?? "https://api-production-38d4.up.railway.app/api";
const DIST = path.resolve("dist");

const STATIC_PAGES = [
  {
    path: "/products",
    title: "All Scents",
    description:
      "Browse every Lullaby scent — hand-poured candles in handmade gypsum vessels, each with a packet of seeds hidden inside.",
  },
  {
    path: "/about",
    title: "About Us",
    description:
      "The story behind Lullaby — handmade candles in gypsum vessels, poured with natural coconut wax, with a packet of seeds hidden inside every one.",
  },
  {
    path: "/contact",
    title: "Contact Us",
    description:
      "Get in touch with Lullaby — questions about orders, direct orders, shipping, or anything else.",
  },
  {
    path: "/terms",
    title: "Terms & Conditions",
    description:
      "Lullaby's terms and conditions — ordering, free shipping, returns, and candle care.",
  },
  {
    path: "/privacy-policy",
    title: "Privacy Policy",
    description:
      "How Lullaby collects, uses, and protects your information — including analytics and advertising cookies.",
  },
];

const escapeAttr = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

const toMetaDescription = (text, max = 160) => {
  const clean = String(text ?? "").replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max - 1).trimEnd()}…` : clean;
};

function setTag(html, selector, attr, value) {
  const pattern = new RegExp(`(<[^>]*${selector}[^>]*\\b${attr}=")[^"]*(")`);
  if (!pattern.test(html)) throw new Error(`prerender: tag not found: ${selector}`);
  return html.replace(pattern, `$1${escapeAttr(value)}$2`);
}

function renderPage(template, { path: pagePath, title, description, image, type }) {
  const fullTitle = `${title} | ${SITE_NAME}`;
  const url = `${SITE_URL}${pagePath}`;
  let html = template.replace(/<title>[^<]*<\/title>/, `<title>${escapeAttr(fullTitle)}</title>`);
  html = setTag(html, 'name="description"', "content", description);
  html = setTag(html, 'rel="canonical"', "href", url);
  html = setTag(html, 'property="og:type"', "content", type ?? "website");
  html = setTag(html, 'property="og:title"', "content", fullTitle);
  html = setTag(html, 'property="og:description"', "content", description);
  html = setTag(html, 'property="og:url"', "content", url);
  if (image) html = setTag(html, 'property="og:image"', "content", image);
  return html;
}

async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE_URL}/products`);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return (await res.json()).filter((product) => product.is_active);
  } catch (error) {
    console.warn("[prerender] could not fetch products, skipping product pages:", error.message);
    return [];
  }
}

const template = await readFile(path.join(DIST, "index.html"), "utf8");

const productPages = (await fetchProducts()).map((product) => ({
  path: `/products/${product.slug}`,
  title: product.name,
  description: toMetaDescription(product.description),
  // Resized by the backend; full-size originals can exceed Facebook's 8 MB limit.
  image: product.image ? `${product.image}?w=1200` : undefined,
  type: "product",
}));

const pages = [...STATIC_PAGES, ...productPages];
for (const page of pages) {
  const outDir = path.join(DIST, ...page.path.split("/").filter(Boolean));
  await mkdir(outDir, { recursive: true });
  await writeFile(path.join(outDir, "index.html"), renderPage(template, page), "utf8");
}

console.log(`[prerender] wrote ${pages.length} pages with their own meta tags`);
