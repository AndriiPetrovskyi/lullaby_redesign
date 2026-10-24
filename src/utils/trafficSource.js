// Where this visit came from, for the checkout funnel in the admin. Taken
// from the page the visitor landed on (ads add utm_* or fbclid/gclid; links
// from other sites leave a referrer) and kept for the rest of the tab's
// session, since the checkout is usually a few clicks after landing.

const STORAGE_KEY = "lullaby-traffic-source";

const KNOWN_SITES = [
  [/(^|\.)instagram\.com$/, "instagram"],
  [/(^|\.)facebook\.com$|(^|\.)fb\.com$|(^|\.)messenger\.com$/, "facebook"],
  [/(^|\.)google\./, "google"],
  [/(^|\.)tiktok\.com$/, "tiktok"],
  [/(^|\.)pinterest\./, "pinterest"],
  [/(^|\.)etsy\.com$/, "etsy"],
  [/(^|\.)bing\.com$/, "bing"],
];

function detectSource() {
  const params = new URLSearchParams(window.location.search);
  const utmSource = params.get("utm_source");
  if (utmSource) {
    return { source: utmSource.toLowerCase(), campaign: params.get("utm_campaign") };
  }
  if (params.has("fbclid")) return { source: "facebook", campaign: null };
  if (params.has("gclid")) return { source: "google", campaign: null };

  let referrerHost = "";
  try {
    referrerHost = document.referrer ? new URL(document.referrer).hostname : "";
  } catch {
    // malformed referrer — treat as direct
  }
  if (!referrerHost || referrerHost === window.location.hostname) {
    return { source: "direct", campaign: null };
  }
  const known = KNOWN_SITES.find(([pattern]) => pattern.test(referrerHost));
  return { source: known ? known[1] : referrerHost.replace(/^www\./, ""), campaign: null };
}

let current = null;

function captureTrafficSource() {
  try {
    const stored = sessionStorage.getItem(STORAGE_KEY);
    if (stored) {
      current = JSON.parse(stored);
      return;
    }
  } catch {
    // storage blocked — keep it in memory for this page load
  }
  current = detectSource();
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(current));
  } catch {
    // see above
  }
}

if (typeof window !== "undefined") captureTrafficSource();

export const getTrafficSource = () => current ?? { source: "direct", campaign: null };
