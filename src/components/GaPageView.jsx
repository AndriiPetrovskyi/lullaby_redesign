"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { trackGaPageView } from "../utils/googleAnalytics.js";

// GA4 page_view for a redesigned page, with its title (the pages not yet
// redesigned send theirs from <Seo>). Renders nothing.
function GaPageView({ title }) {
  const pathname = usePathname();

  useEffect(() => {
    trackGaPageView(title);
  }, [pathname, title]);

  return null;
}

export default GaPageView;
