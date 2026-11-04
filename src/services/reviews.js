import { API_BASE_URL } from "./api.js";

export async function getReviews() {
  const res = await fetch(`${API_BASE_URL}/reviews`);
  if (!res.ok) throw new Error("Could not load reviews");
  return res.json();
}
