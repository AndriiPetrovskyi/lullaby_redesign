import { HelmetProvider } from "react-helmet-async";
import "../utils/trafficSource.js";
import CookieBanner from "./CookieBanner.jsx";
import Footer from "./Footer.jsx";
import MetaPixelTracker from "./MetaPixelTracker.jsx";
import Navbar from "./Navbar.jsx";
import OrderingPausedBanner from "./OrderingPausedBanner.jsx";
import ScrollToTop from "./ScrollToTop.jsx";
import { useIsMobile } from "../hooks/useIsMobile.js";
import MobileFooter from "../mobile/components/Footer.jsx";
import MobileNavbar from "../mobile/components/Navbar.jsx";

// Around every page: tracking, the ordering-paused banner, menu, footer and
// cookie banner. Browser only for now (the menus pick the phone or desktop
// version from the window width); the redesign's header and footer replace it.
function SiteShell({ children }) {
  const isMobile = useIsMobile();

  return (
    <HelmetProvider>
      <ScrollToTop />
      <MetaPixelTracker />
      <OrderingPausedBanner />
      {isMobile ? <MobileNavbar /> : <Navbar />}
      {children}
      {isMobile ? <MobileFooter /> : <Footer />}
      <CookieBanner />
    </HelmetProvider>
  );
}

export default SiteShell;
