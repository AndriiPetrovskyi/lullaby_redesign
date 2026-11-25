"use client";

import "../utils/trafficSource.js";
import CookieBanner from "./CookieBanner.jsx";
import MetaPixelTracker from "./MetaPixelTracker.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

// Around every page: the Meta Pixel PageView on each page and the cookie
// banner. The header, footer and ordering-paused banner are in app/layout.jsx.
function SiteShell({ children }) {
  return (
    <>
      <ScrollToTop />
      <MetaPixelTracker />
      {children}
      <CookieBanner />
    </>
  );
}

export default SiteShell;
