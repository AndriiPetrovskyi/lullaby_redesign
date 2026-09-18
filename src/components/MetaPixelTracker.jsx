import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { initMetaPixel, trackPageView } from "../utils/metaPixel.js";

// A plain <script> pixel snippet only fires PageView once, on first load —
// but this is a client-side-routed SPA, so going from "/" to
// "/products/foo" never reloads the page and would otherwise go untracked.
// This fires PageView on every route change instead (mirrors the pattern in
// ScrollToTop.jsx, which listens to the same useLocation() pathname).
function MetaPixelTracker() {
  const { pathname } = useLocation();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current) {
      initMetaPixel();
      hasInitialized.current = true;
    }
    trackPageView();
  }, [pathname]);

  return null;
}

export default MetaPixelTracker;
