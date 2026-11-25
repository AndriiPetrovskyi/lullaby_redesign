import { SITE_URL } from "../src/config/seo.js";
import { fetchProducts } from "../src/lib/serverApi.js";

export const revalidate = 3600;

const STATIC_PATHS = ["/", "/products", "/about", "/contact", "/terms", "/privacy-policy"];

export default async function sitemap() {
  const slugs = (await fetchProducts()).map((product) => product.slug);
  return [...STATIC_PATHS, ...slugs.map((slug) => `/products/${slug}`)].map((path) => ({
    url: `${SITE_URL}${path}`,
  }));
}
