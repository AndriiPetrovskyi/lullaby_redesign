import { API_BASE_URL } from "./api.js";

// Anonymous checkout funnel (see the "CheckoutVisit" page in the admin).
// Failures are ignored — statistics must never get in the way of a purchase.

export async function openCheckoutVisit(payload) {
  try {
    const res = await fetch(`${API_BASE_URL}/checkout-visits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) return null;
    const { id } = await res.json();
    return id ?? null;
  } catch {
    return null;
  }
}

export function updateCheckoutVisit(id, changes) {
  fetch(`${API_BASE_URL}/checkout-visits/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(changes),
    // Lets the last update survive the visitor closing the tab.
    keepalive: true,
  }).catch(() => {});
}
