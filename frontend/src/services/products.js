const API_BASE_URL = "http://localhost:3000/api";

export async function getProducts() {
  const res = await fetch(`${API_BASE_URL}/products`);
  if (!res.ok) throw new Error("Не вдалося завантажити товари");
  return res.json();
}

export async function getProductBySlug(slug) {
  const res = await fetch(`${API_BASE_URL}/products/${slug}`);
  if (!res.ok) throw new Error("Не вдалося завантажити товар");
  return res.json();
}
