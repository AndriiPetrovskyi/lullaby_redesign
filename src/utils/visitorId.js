// A random id that tells the checkout funnel in the admin when the same
// browser comes back to the checkout ("Visitor" column). It says nothing
// about who the visitor is. Kept in localStorage only when tracking is
// allowed (see consent.js) and removed if the visitor withdraws consent;
// otherwise the backend falls back to a rougher network-based tag.

import { getConsentStatus, onConsentRevoked } from "./consent.js";

const STORAGE_KEY = "lullaby-visitor-id";

export function getVisitorId() {
  if (getConsentStatus() !== "granted") return null;
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id && typeof crypto?.randomUUID === "function") {
      id = crypto.randomUUID();
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return null; // storage blocked
  }
}

onConsentRevoked(() => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // storage blocked — nothing was stored
  }
});
