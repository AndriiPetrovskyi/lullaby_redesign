import { SITE_URL } from "../src/config/seo.js";

const API_BASE_URL = process.env.VITE_API_BASE_URL;

export const revalidate = 3600;

const STATIC_PATHS = ["/", "/products", "/about", "/contact", "/terms", "/privacy-policy"];

async function productSlugs() {
  if (!API_BASE_URL?.startsWith("http")) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { next: { revalidate } });
    if (!res.ok) return [];
    return (await res.json()).map((product) => product.slug);
  } catch {
    return [];
  }
}

export default async function sitemap() {
  const slugs = await productSlugs();
  return [...STATIC_PATHS, ...slugs.map((slug) => `/products/${slug}`)].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
