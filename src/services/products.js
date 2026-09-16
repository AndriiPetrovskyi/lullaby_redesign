const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api";

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Could not load products");
  return res.json();
}

export async function getProductBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Could not load product");
  return res.json();
}
