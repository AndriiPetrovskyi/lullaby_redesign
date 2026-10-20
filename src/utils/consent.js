// Cookie consent for analytics and ad tracking (Google Analytics, Meta).
//
// Visitors from the EU/EEA, the UK and Switzerland are asked first; everyone
// else is tracked as before without a banner. The backend tells us which
// group a visitor is in (GET /api/geo). Until that's known — or until an EU
// visitor answers — tracking calls are queued, then either run or dropped.
//
// status: "pending" (still finding out) | "ask" (show the banner)
//       | "granted" | "denied"

const STORAGE_KEY = "lullaby-tracking-consent";

let status = "pending";
let decision = readStoredDecision(); // the visitor's own answer, if any
let isBannerReopened = false;
const queue = [];
const listeners = new Set();

function readStoredDecision() {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch {
    return null;
  }
}

function setStatus(next) {
  status = next;
  if (status === "granted") {
    queue.splice(0).forEach((run) => run());
  } else if (status === "denied") {
    queue.length = 0;
  }
  listeners.forEach((listener) => listener());
}

async function detectRegion() {
  if (decision) return setStatus(decision);
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  try {
    const response = await fetch(`${apiBase}/geo`);
    const { consentRequired } = await response.json();
    setStatus(consentRequired ? "ask" : "granted");
  } catch {
    // Can't tell where the visitor is — ask rather than assume.
    setStatus("ask");
  }
}

if (typeof window !== "undefined") detectRegion();

export const getConsentStatus = () => status;
export const isBannerVisible = () => status === "ask" || isBannerReopened;

// Runs `fn` now if tracking is allowed, later if we're still waiting for an
// answer, or never if the visitor declined.
export function whenTrackingAllowed(fn) {
  if (status === "granted") fn();
  else if (status !== "denied") queue.push(fn);
}

// What the backend should do with this buyer's purchase: report it to Meta
// and Google, or not. Unknown (still pending) counts as no.
export const hasTrackingConsent = () => status === "granted";

const revokeListeners = new Set();
export const onConsentRevoked = (listener) => revokeListeners.add(listener);

export function setConsent(choice) {
  const wasGranted = status === "granted";
  decision = choice;
  isBannerReopened = false;
  try {
    localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // storage blocked — the choice still holds for this visit
  }
  setStatus(choice);
  if (wasGranted && choice === "denied") revokeListeners.forEach((listener) => listener());
}

// "Cookie settings" link in the footer.
export function reopenConsentBanner() {
  isBannerReopened = true;
  listeners.forEach((listener) => listener());
}

export function subscribeToConsent(listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}
