import { API_BASE_URL } from "./api.js";
import { hasTrackingConsent } from "../utils/consent.js";
import { getGaIds } from "../utils/googleAnalytics.js";

const readCookie = (name) =>
  document.cookie
    .split("; ")
    .find((row) => row.startsWith(`${name}=`))
    ?.split("=")[1];

// Ad and analytics ids the backend needs to report the purchase later.
export const orderTrackingFields = () => ({
  fbp: readCookie("_fbp"),
  fbc: readCookie("_fbc"),
  ...getGaIds(),
  trackingConsent: hasTrackingConsent(),
});

export async function getCheckoutConfig() {
  const res = await fetch(`${API_BASE_URL}/orders/config`);
  if (!res.ok) throw new Error("Could not load checkout settings");
  return res.json();
}

export async function createOrder(payload) {
  const res = await fetch(`${API_BASE_URL}/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.error ?? "Something went wrong. Please try again.");
  }
  return data;
}

export async function getOrderStatus(orderId) {
  const res = await fetch(`${API_BASE_URL}/orders/${encodeURIComponent(orderId)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error("Could not load order");
  return res.json();
}

// The payment gateway only accepts a classic form POST, so build one and
// submit it — the browser leaves the site for the payment page.
export function redirectToPayment({ action, fields }) {
  const form = document.createElement("form");
  form.method = "post";
  form.action = action;
  form.acceptCharset = "utf-8";
  for (const [name, value] of Object.entries(fields)) {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    form.appendChild(input);
  }
  document.body.appendChild(form);
  form.submit();
}

// The checkout's email and quantity as last submitted, so coming back from
// the payment page (or retrying after cancelling) doesn't mean typing it
// again. Session storage only: it dies with the tab and never leaves the
// browser.
const DRAFT_KEY = "checkout-draft";

export function saveCheckoutDraft(productSlug, draft) {
  try {
    sessionStorage.setItem(DRAFT_KEY, JSON.stringify({ productSlug, ...draft }));
  } catch {
    // storage unavailable — the form just starts empty next time
  }
}

export function readCheckoutDraft(productSlug) {
  try {
    const draft = JSON.parse(sessionStorage.getItem(DRAFT_KEY) ?? "null");
    return draft?.productSlug === productSlug ? draft : null;
  } catch {
    return null;
  }
}
