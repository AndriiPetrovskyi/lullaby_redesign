// Reads from the backend on the server (metadata, sitemap). Pages pick up
// changes made in the admin within five minutes.
// The browser's API address; in the local phone setup it's the relative
// /api, and the server goes straight to the backend behind it instead.
const API_BASE_URL = process.env.VITE_API_BASE_URL?.startsWith("http")
  ? process.env.VITE_API_BASE_URL
  : process.env.DEV_API_PROXY;
export const REVALIDATE_SECONDS = 300;

const canFetch = () => Boolean(API_BASE_URL);

// The product, null when there is none, undefined when the backend can't say.
export async function fetchProduct(slug) {
  if (!canFetch()) return undefined;
  try {
    const res = await fetch(`${API_BASE_URL}/products/${encodeURIComponent(slug)}`, {
      next: { revalidate: REVALIDATE_SECONDS },
    });
    if (res.status === 404) return null;
    if (!res.ok) return undefined;
    return await res.json();
  } catch {
    return undefined;
  }
}

export async function fetchProducts() {
  if (!canFetch()) return [];
  try {
    const res = await fetch(`${API_BASE_URL}/products`, { next: { revalidate: REVALIDATE_SECONDS } });
    return res.ok ? await res.json() : [];
  } catch {
    return [];
  }
}

// The candles marked as bestsellers in the admin (`isBestseller`). Until the
// backend has that switch, the first three.
export async function fetchBestsellers() {
  const products = await fetchProducts();
  const picked = products.filter((product) => product.isBestseller);
  return (picked.length > 0 ? picked : products).slice(0, 3);
}
