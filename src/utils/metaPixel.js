import { META_PIXEL_ID, isTrackingEnabled } from "../config/tracking.js";

let isPixelInitialized = false;

// Meta's official base snippet, loaded only once, only when tracking is
// actually enabled (production build + pixel ID configured).
export function initMetaPixel() {
  if (!isTrackingEnabled || isPixelInitialized) return;
  isPixelInitialized = true;

  /* eslint-disable */
  (function (f, b, e, v, n, t, s) {
    if (f.fbq) return;
    n = f.fbq = function () {
      n.callMethod
        ? n.callMethod.apply(n, arguments)
        : n.queue.push(arguments);
    };
    if (!f._fbq) f._fbq = n;
    n.push = n;
    n.loaded = true;
    n.version = "2.0";
    n.queue = [];
    t = b.createElement(e);
    t.async = true;
    t.src = v;
    s = b.getElementsByTagName(e)[0];
    s.parentNode.insertBefore(t, s);
  })(
    window,
    document,
    "script",
    "https://connect.facebook.net/en_US/fbevents.js",
  );
  /* eslint-enable */

  window.fbq("init", META_PIXEL_ID);
}

function generateEventId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `evt_${Date.now()}_${Math.random().toString(36).slice(2)}`;
}

// Forwards the event to our backend, which relays it to Meta's Conversions
// API — the server-side half of the same event the pixel just tracked.
//
// Deliberately NOT navigator.sendBeacon(): the frontend and backend live on
// different origins (GH Pages/Netlify vs Railway), and sendBeacon always
// sends credentials (cookies) on cross-origin requests, which the CORS spec
// forbids combining with a wildcard Access-Control-Allow-Origin — the
// backend intentionally allows any origin, so that combination gets
// silently blocked. `fetch` defaults to NOT sending credentials
// cross-origin, so it's the transport that actually works here.
// `keepalive: true` gives it the same "survives page unload" guarantee
// sendBeacon is normally used for (e.g. the click that navigates to Etsy).
function sendToConversionsApi(eventName, eventId, customData) {
  const apiBase = import.meta.env.VITE_API_BASE_URL;
  if (!apiBase) return;

  const payload = {
    event_name: eventName,
    event_id: eventId,
    event_time: Math.floor(Date.now() / 1000),
    event_source_url: window.location.href,
    custom_data: customData,
  };

  fetch(`${apiBase}/track`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
    keepalive: true,
  }).catch(() => {});
}

// Tracks one event through both channels (pixel + Conversions API) under a
// shared event_id, so Meta deduplicates them into a single event instead of
// double-counting. No-ops entirely when tracking is disabled.
export function trackEvent(eventName, customData = {}) {
  if (!isTrackingEnabled) return;

  const eventId = generateEventId();

  if (window.fbq) {
    window.fbq("track", eventName, customData, { eventID: eventId });
  }

  sendToConversionsApi(eventName, eventId, customData);
}

export function trackPageView() {
  trackEvent("PageView", {});
}
