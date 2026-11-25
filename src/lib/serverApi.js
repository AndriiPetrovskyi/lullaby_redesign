// Reads from the backend on the server (metadata, sitemap). Pages pick up
// changes made in the admin within five minutes.
const API_BASE_URL = process.env.VITE_API_BASE_URL;
export const REVALIDATE_SECONDS = 300;

// Relative in the local phone setup (/api through the dev proxy): no server fetch.
const canFetch = () => API_BASE_URL?.startsWith("http");

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
