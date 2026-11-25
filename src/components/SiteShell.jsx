import { HelmetProvider } from "react-helmet-async";
import "../utils/trafficSource.js";
import CookieBanner from "./CookieBanner.jsx";
import MetaPixelTracker from "./MetaPixelTracker.jsx";
import ScrollToTop from "./ScrollToTop.jsx";

// Around every page, in the browser: the Meta Pixel PageView on each page,
// the cookie banner, and the head tags the current page components set.
// The header, footer and ordering-paused banner are in app/layout.jsx.
function SiteShell({ children }) {
  return (
    <HelmetProvider>
      <ScrollToTop />
      <MetaPixelTracker />
      {/* The header lies over the page; these older pages don't leave room
          for it themselves. Goes away as the pages are redesigned. */}
      <div className="legacy-page">{children}</div>
      <CookieBanner />
    </HelmetProvider>
  );
}

export default SiteShell;
