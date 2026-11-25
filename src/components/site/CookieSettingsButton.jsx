"use client";

import { reopenConsentBanner } from "../../utils/consent.js";

function CookieSettingsButton({ className }) {
  return (
    <button type="button" className={className} onClick={reopenConsentBanner}>
      Cookie settings
    </button>
  );
}

export default CookieSettingsButton;
