import { useSyncExternalStore } from "react";
import { Link } from "react-router-dom";
import {
  isBannerVisible,
  setConsent,
  subscribeToConsent,
} from "../utils/consent.js";
import "./CookieBanner.css";

// Shown to visitors from the EU/EEA, the UK and Switzerland until they
// choose, and to anyone who opens "Cookie settings" in the footer. Accept and
// Decline are equally easy, as GDPR expects.
function CookieBanner() {
  const isVisible = useSyncExternalStore(subscribeToConsent, isBannerVisible, () => false);
  if (!isVisible) return null;

  return (
    <div className="cookie-banner" role="dialog" aria-labelledby="cookie-banner-text">
      <p id="cookie-banner-text" className="cookie-banner-text">
        We use cookies to see how the shop is used and to measure our ads
        (Google Analytics, Meta). The shop works the same either way.{" "}
        <Link to="/privacy-policy" className="cookie-banner-link">
          Privacy Policy
        </Link>
      </p>
      <div className="cookie-banner-actions">
        <button
          type="button"
          className="cookie-banner-button cookie-banner-button--secondary"
          onClick={() => setConsent("denied")}>
          Decline
        </button>
        <button
          type="button"
          className="cookie-banner-button"
          onClick={() => setConsent("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}

export default CookieBanner;
