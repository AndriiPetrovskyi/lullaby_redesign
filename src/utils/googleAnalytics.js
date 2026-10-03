import { GA_MEASUREMENT_ID, isGaEnabled } from "../config/tracking.js";

let isGaInitialized = false;

// Google's standard gtag.js snippet, loaded once and only when GA is enabled.
// send_page_view is off because this is a client-side-routed SPA: page views
// are sent manually on every route change (see trackGaPageView). The stream's
// "page changes based on browser history events" option is switched off in
// GA4 for the same reason — leaving it on would count every navigation twice.
export function initGoogleAnalytics() {
  if (!isGaEnabled || isGaInitialized) return;
  isGaInitialized = true;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
}

export function trackGaEvent(eventName, params = {}) {
  if (!isGaEnabled) return;
  initGoogleAnalytics();
  window.gtag("event", eventName, params);
}

// Called from <Seo> rather than on route change: document.title is updated
// by Helmet asynchronously, and product pages only know their title once the
// product has loaded — reading document.title at navigation time would log
// the previous page's title.
let lastPageView = null;

export function trackGaPageView(pageTitle) {
  // Pages that show a loading state mount <Seo> twice (loading, then loaded)
  // with the same path and title — count that as one view, not two.
  const key = `${window.location.pathname}|${pageTitle}`;
  if (key === lastPageView) return;
  lastPageView = key;

  trackGaEvent("page_view", {
    page_location: window.location.href,
    page_path: window.location.pathname,
    page_title: pageTitle,
  });
}

// GA4's recommended e-commerce shape for a single product.
export function gaItem(product) {
  return {
    currency: "USD",
    value: Number(product.price),
    items: [
      {
        item_id: product.slug,
        item_name: product.name,
        price: Number(product.price),
        quantity: 1,
      },
    ],
  };
}
